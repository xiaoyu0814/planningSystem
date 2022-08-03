export const SideEnum = {
    SideRed:1,
    SideBlue:2,
    SideGreen:3,
    SideOrange:4,
    SideYellow:5,
    SidePurple:6,
};
export const NodeUnit = {
    NodeType:{
        NodeGroup:1,
        Unkown:-1
    },
    // NodeGroup:1, 
    Unkown:-1,
    NodeGroup:"指挥",
    NodeCGF:"兵力",
    nodeId:0,
    navPathNum:0,
    areaPathNum:0,
    routePathNum:0,
}

export const AreaTypes = [
    {label:'无',value:-1},
    {label:"渔区",value:0},
    {label:"贸易区",value:1},
    {label:"民事禁区",value:2},
    {label:"雷区",value:3},
    {label:"军事区",value:4},
    {label:"环境",value:5},
    {label:"停泊区",value:6},
    {label:"无菌区",value:11},
    {label:"军事分离区",value:12},
    {label:"可疑区",value:19},
    {label:"禁区",value:20},
    {label:"地形区",value:21},
    {label:"水",value:22},
    {label:"泥",value:23},
    {label:"平坦道路",value:24},
    {label:"非平坦道路",value:25},
    {label:"沙丘",value:26},
    {label:"沼泽",value:27},
    {label:"海岸",value:28},
    {label:"房屋",value:29},
    {label:"树",value:30},
    {label:"林区",value:31},
];

export const AreaAscriptions = [
    {label:"无",value:-1},
    {label:"红方",value:1},
    {label:"蓝方",value:2},
    {label:"绿方",value:3},
    {label:"橙方",value:4},
    {label:"黄方",value:5},
    {label:"紫方",value:6},
]