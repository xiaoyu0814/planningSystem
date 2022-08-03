export default {
    teacher: true, // 切换老师/学生系统; 老师:true;学生:false
    XDType: 0, // 切换想定类型，老师/学生; 老师:0;学生:1
    vue: null,
    teacherXmlId: "",

    layerManagemen_show: false,
    jbDraw_show: false,
    setMarshalling_show: false,
    chart_show: false,
    message_show: false,
    determinedToSuggest_show: false,
    makeUpYourMind_show: false,
    documentation_show: false,
    check_show: false,
    measureDistance_show: false,
    measureArea_show: false,
    position_show: false,
    navPath_show: false,
    background_show: false,
    slopeDirection_show: false,
    slope_show: false,
    analysis_show: false,
    viewsheld_show: false,
    operationalAnalysis_show: false,
    teamPosition_show: false,
    routePath_show: false,
    edit_show: false,
    bufferAnalysis_show: false,
    flood_show: false,
    flatAnalysis_show: false,
    watian_show: false,
    poumian_show: false,
    jiaodu_show: false,
    fuzhufenxi_show: false,
    showorhidden: true,

    interestAreaPath_show: false, //兴趣区
    operationAreaPath_show: false, //操作区
    interestPosition_show: false, //兴趣点

    selectCGF_data: null,

    sendingAndReceivingOfDocuments_show: false,
    environmentSettings_show: false,

    map_controller: null,
    map: null,
    distance: "", // 测距
    CGFListData: [],
    navPathData: {
        test: []
    },
    navPathList: [], // 导航线回显
    navPathId: "test",
    lineLayerId: [],
    addNavPath_data: "",
    documentContent: "",
    progress: 1,
    document_IdArray: [],
    temp_JBLayer: [],
    JBLayer: [],
    documentation_name: "",
    documentation_fromList: false,
    routePathId: "test",
    addRoutePath_data: "",

    areaPathList: [],
    areaPath_show: false,
    areaPath: {},

    teamPositionList: [],
    teamPosition: {
        test: []
    },
    teamPositionId: "",

    login_interval: null,

    routePathList: [],

    makeUpYourMind_num: 0, //判断第几次编成编组

    CGF_nodeData: null,

    JBtext_show: false,
    JBtext_value: "",
    JBtext_data: null,
    JBtext_map: null,

    CGFSelectData: {},

    selectAddCGF: [],

    CGFReadListData: [],

    CGFEditListData: [],

    transition: true,

    mapLevelList: {}, //图层面板数据

    mapLevelCheck: [],

    getSelent_show: false,

    navPathList_json: {},

    navPathList_CGF: {},
}