import React, { Component } from 'react';
import {Tree,Drawer,Button} from 'antd';
import Uaa from './aaa.js';
import {Select} from '../../../node_modules/ol/interaction.js';
import {click,singleClick,doubleClick,focus,pointerMove} from '../../../node_modules/ol/events/condition.js';
import Map from '../../../node_modules/ol/Map.js';
import View from '../../../node_modules/ol/View.js';
import Overlay from '../../../node_modules/ol/Overlay.js';
import {OSM, Vector as VectorSource} from '../../../node_modules/ol/source.js';
import GeoJSON from '../../../node_modules/ol/format/GeoJSON.js';
import {Tile as TileLayer, Vector as VectorLayer} from '../../../node_modules/ol/layer.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from '../../../node_modules/ol/style.js';
//引入样式和交互样式函数
import {styleFunction}from '../../slfJS/color.js';
import {changeStyle} from '../../slfJS/colorChange.js';
//引入popup悬浮窗样式
import("../../css/popup.css");

var vectorLayer_boundary=null;
var vectorLayer_line=null;
var vectorLayer_point=null;
var map=null;
const TreeNode = Tree.TreeNode;
const treeData = [{
    title: '排水管网',
    key: 'GW'
}, {
    title: '排水节点',
    key: 'JD'
},{
    title: '片区分布',
    key: 'PQ',
},{
    title: '污水厂',
},{
    title: '污水收集率热力图',
}];
class BaiduContainer extends Component {
    state = {
        autoExpandParent: true,
        checkedKeys: ['GW','JD','PQ'],
        selectedKeys: [],
        abb:false
    };
    //抽屉关闭函数
    onClose = () => {
        this.setState({
            abb: !this.state.abb,
        });
    };
    onStart=(e)=>{
        var arr=e.target;//获取事件对象，即产生这个事件的元素-->ol.interaction.Select
        var collection = arr.getFeatures();//获取这个事件绑定的features-->返回值是一个ol.Collection对象
        var features = collection.getArray();//获取这个集合的第一个元素-->真正的feature
        if(features.length>0){
            this.setState({
                abb:!this.state.abb,
            });
            var obj = features[0].get("US_ID");//获取之前绑定的ID,返回是一个json字符串
        }
    };
    //树结构相应函数
    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys });
        map.removeLayer(vectorLayer_boundary);
        map.removeLayer(vectorLayer_line);
        map.removeLayer(vectorLayer_point);
        for(let i=0;i<checkedKeys.length;i++){
            switch(checkedKeys[i])
            {
                case 'GW':
                    map.addLayer(vectorLayer_line)
                    break;
                case 'JD':
                    map.addLayer(vectorLayer_point);
                    break;
                case 'PQ':
                    map.addLayer(vectorLayer_boundary);
                    break;
            }
        }
    }

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', selectedKeys);
        this.setState({ selectedKeys });
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }
    componentDidMount(){
        //##########################################
        /**
         * Elements that make up the popup.
         */
        const container = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        const closer = document.getElementById('popup-closer');
        /**
         * Create an overlay to anchor the popup to the map.
         */
        const overlay = new Overlay({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });
        /**
         * Add a click handler to hide the popup.
         * @return {boolean} Don't follow the href.
         */
        closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };

        map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM(),
                    opacity:0.5
                })
            ],
            target: 'map1',
            view: new View({
                center: [114.2, 22.68],
                zoom: 12,
                projection:'EPSG:4326'
            })
        });
        //################设置交互事件##########################
        var selectClick = new Select({
            condition: pointerMove,
            style:changeStyle
        });
        map.addInteraction(selectClick);
        //################设置交互事件##########################
        var selectClick1 = new Select({
            condition: singleClick
        });
        map.addInteraction(selectClick1);
        selectClick1.on("select",this.onStart);

        //##########################################
        map.on('pointermove', function(evt) {
            var pixel = map.getEventPixel(evt.originalEvent);
            var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });//判断当前单击处是否有要素，捕获到要素时弹出popup
            if (feature !== undefined) {
                map.addOverlay(overlay);
                var type=feature.getGeometry().getType();
                const coordinate = evt.coordinate;

                switch (type)
                {
                    case "Point":
                        var Feature_P=feature.get("Feature_P");
                        var Appendant=feature.get("Appendant");
                        content.innerHTML ="节点信息"+'<hr/>'+
                            '特征:'+Feature_P+'<hr/>'+
                            '附属物:'+Appendant;
                        break;
                    case "MultiLineString":
                        var US_ID=feature.get("US_ID");
                        var DS_ID=feature.get("DS_ID");
                        var DIAMETER=feature.get("Diameter");
                        var MATERIAL=feature.get("Material");
                        content.innerHTML ="管线信息"+'<hr/>'+
                            'US_ID:'+US_ID+'<hr/>'+'DS_ID:'+DS_ID+'<hr/>'+
                            '材料:'+MATERIAL+'<hr/>'+'管径:'+DIAMETER;
                        break;
                    case "MultiPolygon":
                        content.innerHTML ="TYPE:"+type;
                        break;
                }
                overlay.setPosition(coordinate);
            }else{
                map.removeOverlay(overlay);
            }
        });

        //###################开始添加各种要素#######################
        fetch('../kml/boundary.geojson').then((res)=>{
            if(res.ok){
                res.text().then((data)=>{
                    var feature=(new GeoJSON()).readFeatures(data);
                    const vectorSource = new VectorSource({
                        features: feature
                    });
                    vectorLayer_boundary = new VectorLayer({
                        source: vectorSource,
                        style: styleFunction,
                        minResolution:1/10000
                    });
                    map.addLayer(vectorLayer_boundary);
                })
            }
        }).catch((res)=>{
            console.log(res.status);
        });
        //##########################################
        fetch('../kml/longchengLine.geojson').then((res)=>{
            if(res.ok){
                res.text().then((data)=>{
                    const vectorSource1 = new VectorSource({
                        features: (new GeoJSON()).readFeatures(data)
                    });
                    vectorLayer_line = new VectorLayer({
                        source: vectorSource1,
                        style: styleFunction,
                        maxResolution:1/5500
                    });
                    map.addLayer(vectorLayer_line);
                })
            }
        }).catch((res)=>{
            console.log(res.status);
        });

        //##########################################
        fetch('../kml/longchengPoint.geojson').then((res)=>{
            if(res.ok){
                res.text().then((data)=>{
                    const vectorSource2 = new VectorSource({
                        features: (new GeoJSON()).readFeatures(data)
                    });
                    vectorLayer_point = new VectorLayer({
                        source: vectorSource2,
                        style: styleFunction,
                        maxResolution:1/55000
                    });
                    map.addLayer(vectorLayer_point);
                })
            }
        }).catch((res)=>{
            console.log(res.status);
        });
    }
    render() {
        return (
            <div className="a">
                <div className={"b"} >
                    <Tree
                        showLine={false}
                        showIcon={false}
                        checkable={true}
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                        selectedKeys={this.state.selectedKeys}
                    >
                        {this.renderTreeNodes(treeData)}
                    </Tree>
                </div>
                <div id='map1' style={{height:800}}></div>
                <div id="popup" className="ol-popup">
                    <a href="#" id="popup-closer" className="ol-popup-closer"></a>
                    <div id="popup-content"></div>
                </div>
                <Uaa visible={this.state.abb}
                     onClick={() => this.onClose()}
                />
            </div>
        );
    }
}
export default BaiduContainer;
