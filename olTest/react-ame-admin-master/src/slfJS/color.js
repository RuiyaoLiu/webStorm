//设置初始的要素样式
import {Circle as CircleStyle, Fill, Stroke, Style} from '../../node_modules/ol/style.js';
//雨水节点
const image_Y = new CircleStyle({
    radius: 6,
    fill: new Fill({
        color: 'rgba(0, 255, 0, 0.6)'
    }),
    stroke: new Stroke({color: 'green', width: 1})
});
//污水节点
const image_W = new CircleStyle({
    radius: 6,
    fill: new Fill({
        color: 'rgba(255, 0, 0, 0.6)'
    }),
    stroke: new Stroke({color: 'red', width: 1})
});
//雨污合流节点
const image_YWHL = new CircleStyle({
    radius: 6,
    fill: new Fill({
        color: 'rgba(148,0,211, 0.6)'
    }),
    stroke: new Stroke({color:'rgb(148,0,211)', width: 1})
});

//明沟节点
const image_MG = new CircleStyle({
    radius: 6,
    fill: new Fill({
        color: 'rgba( 0,255,255,0.6)'
    }),
    stroke: new Stroke({color:'rgb(0,255,255)', width: 1})
});
//河道节点
const image_HD = new CircleStyle({
    radius: 6,
    fill: new Fill({
        color: 'rgba(30,144,255,0.6)'
    }),
    stroke: new Stroke({color:'RGB(30,144,255)',width: 1})
});


const Point = {
    'Y': new Style({
        image: image_Y
    }),
    'W': new Style({
        image: image_W
    }),
    'YWHL': new Style({
        image: image_YWHL
    }),
    'MG': new Style({
        image: image_Y
    }),
    'HD': new Style({
        image: image_HD
    })
};
const MultiLineString = {
    'Y': new Style({
        stroke: new Stroke({
            color: 'green',
            width: 2
        })
    }),
    'W': new Style({
        stroke: new Stroke({
            color: 'red',
            width: 2
        })
    }),
    'YWHL': new Style({
        stroke: new Stroke({
            color: 'rgb(148,0,211)',
            width: 2
        })
    }),
    'MG': new Style({
        stroke: new Stroke({
            color: 'green',
            width: 2
        })
    }),
    'HD': new Style({
        stroke: new Stroke({
            color: 'RGB(30,144,255)',
            width: 2
        })
    })
};
const MultiPolygon = {
    'boundary': new Style({
            stroke: new Stroke({
                color: 'blue',
                width: 1
            }),
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)'
            })
        })
};
export function styleFunction(feature) {
    var GeoStyle=feature.getGeometry().getType();
    var StrType=feature.get("TYPE");
    switch (GeoStyle)
    {
        case "Point":
            return Point[StrType];
            break;
        case "MultiLineString":
            return MultiLineString[StrType];
            break;
        case "MultiPolygon":
            return MultiPolygon['boundary'];
            break;
    }
};
