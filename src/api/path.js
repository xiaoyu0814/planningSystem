let path = {
    user: {
        login: (flag ? IP.online : IP.offline) + "/user/login", // 登陆
        // signup: (flag ? IP.online : IP.offline) + "/user/v1/signup", // 注册
        exit: (flag ? IP.online : IP.offline) + "/user/logout", // 退出登陆
        getuserinfo: (flag ? IP.online : IP.offline) + "/user/getUserInfo", // 获取用户信息
        queryByIp: (flag ? IP.online : IP.offline) + "/student/queryByIp", // 根据ip查询学员信息
        queryById: (flag ? IP.online : IP.offline) + "/student/queryById", // 根据id查询学员信息
    },
    group: {
        getallmembers: (flag ? IP.online : IP.offline) + "/group/getAllMembers", // 获取组信息
    },
    message: {
        directsendmsg: (flag ? IP.online : IP.offline) + "/message/directSendMsg", // 发送消息
        gethistorymsgs: (flag ? IP.online : IP.offline) + "/message/getHistoryMsgs", // 获取历史消息
    },
    chart_file: {
        upload: (flag ? IP.online : IP.offline) + "/file/upload",//上传文件
        editFile: (flag ? IP.online : IP.offline) + "/file/editFile",//更新文件
        delete: (flag ? IP.online : IP.offline) + "/file/delete",//删除文件
    },
    xml: {
        teacher_updata: (flag ? IP.online : IP.offline) + "/scenarioFile/uploadTFile", // 上传教员端想定文件
        s_updata: (flag ? IP.online : IP.offline) + "/scenarioFile/uploadSFile", // 上传学员端想定文件
        queryBindXml: (flag ? IP.online : IP.offline) + "/course/queryBindXml", // 查询课程绑定xml记录
        downloadTFile: (flag ? IP.online : IP.offline) + "/scenarioFile/downloadTFile", // 根据xmlId获取教员端想定文件
        downloadTFileBackgroud: (flag ? IP.online : IP.offline) + "/scenarioFile/downloadTFileBackgroud", // 根据xmlId获取教员端想定文件的描述
        queryAllTFile: (flag ? IP.online : IP.offline) + "/scenarioFile/queryAllTFile", // 查询教员端想定列表
        downloadSFile: (flag ? IP.online : IP.offline) + "/scenarioFile/downloadSFile", // 根据用户id和课程id获取学员端想定文件
        uploadTXml: (flag ? IP.online : IP.offline) + "/scenarioFile/uploadTXml", // 上传想定xml文件
    },
    document: {
        uploadPic: (flag ? IP.online : IP.offline) + "/file/uploadPic", // 图片上传
        sendDocument: (flag ? IP.online : IP.offline) + "/document/sendDocument", // 发送文书
        templateList: (flag ? IP.online : IP.offline) + "/document/templateList", // 文书模板列表
        acceptRecord: (flag ? IP.online : IP.offline) + "/document/acceptRecord", // 文书接受记录（收件箱）
        sendRecord: (flag ? IP.online : IP.offline) + "/document/sendRecord", // 文书接受记录（收件箱）
        openDocumentTemplate: (flag ? IP.online : IP.offline) + "/document/openDocumentTemplate", // 打开文书模板/草稿
        keptToSentRecord: (flag ? IP.online : IP.offline) + "/document/keptToSentRecord", // 文书草稿记录
        keptToSent: (flag ? IP.online : IP.offline) + "/document/keptToSent", // 保存文书草稿
        saveToTemplate: (flag ? IP.online : IP.offline) + "/document/saveToTemplate", // 保存文书模板
        deleteDocument: (flag ? IP.online : IP.offline) + "/document/deleteDocument", // 删除文书模板/草稿
        viewFileInfo: (flag ? IP.online : IP.offline) + "/file/viewFileInfo", // 获取文档列表
        readFileByPath: (flag ? IP.online : IP.offline) + "/file/readFileByPath", // 根据路径读取文件
        addDetermine: (flag ? IP.online : IP.offline) + "/determine/addDetermine", // 保存定下决心
        sendTeacherDocument: (flag ? IP.online : IP.offline) + "/document/sendTeacherDocument", // 保存教员导调文书
        sendStudentDocument: (flag ? IP.online : IP.offline) + "/document/sendStudentDocument", // 保存学员导调文书
        getTDocumentByXmlId: (flag ? IP.online : IP.offline) + "/scenarioFile/getTDocumentByXmlId", // 根据xmlId获取相应导调文书
        readWordOfTeacher: (flag ? IP.online : IP.offline) + "/file/readWordOfTeacher", // 读取教员传输的文件
        viewFileByCondition: (flag ? IP.online : IP.offline) + "/file/viewFileByCondition", // 根据条件检索文件
    },
    LayerManagement: {
        showLayer: (flag ? IP.online : IP.offline) + "/layer/showLayer", // 获取图层列表
        showLayerToT: (flag ? IP.online : IP.offline) + "/layer/showLayerToT", // 老师获取图层列表
        newFolder: (flag ? IP.online : IP.offline) + "/layer/newFolder", // 新建文件夹
        deleteLayer: (flag ? IP.online : IP.offline) + "/layer/deleteLayer", // 删除图层
        uploadLayer: (flag ? IP.online : IP.offline) + "/layer/uploadLayer", // 上传图层
        moveLayer: (flag ? IP.online : IP.offline) + "/layer/moveLayer", // 移动图层
        saveLayer: (flag ? IP.online : IP.offline) + "/layer/saveLayer", // 保存图层
        uploadShp: (flag ? IP.online : IP.offline) + "/file/uploadShp", // 上传Shp文件
    },
    nav: {
        saveStage: (flag ? IP.online : IP.offline) + "/appbar/saveStage", // 保存当前课程
        findStage: (flag ? IP.online : IP.offline) + "/appbar/findStage", // 保存当前课程
    },
    upload: {
        saveBase64: (flag ? IP.online : IP.offline) + "/file/uploadPicToTeacher" // 上传gif图片base64到教员端
    },
    geoTileAnalysis: {
        getLineShapeBuffer: (flag ? IP.online : IP.offline) + "/geoTileAnalysis/getLineShapeBuffer", // 线缓冲区分析
        getPointShapeBuffer: (flag ? IP.online : IP.offline) + "/geoTileAnalysis/getPointShapeBuffer", // 点缓冲区分析
        getTifTileByBounds: flood_ip + "/geoTileAnalysis/getTifTileByBounds", // 动态淹没分析
    },
    airportAnalysis: {
        approachSurfaceCal: (flag ? IP.online : IP.offline) + "/airportAnalysis/approachSurfaceCal", // 进近面计算
        innerHorizontalSurfaceCal: (flag ? IP.online : IP.offline) + "/airportAnalysis/innerHorizontalSurfaceCal", // 内水平面计算
        takeoffClimbingSurfaceCal: (flag ? IP.online : IP.offline) + "/airportAnalysis/takeoffClimbingSurfaceCal", // 起飞爬升面计算
        taperedSurfaceCal: (flag ? IP.online : IP.offline) + "/airportAnalysis/taperedSurfaceCal", // 锥形面计算
        transitionSurfaceCal1: (flag ? IP.online : IP.offline) + "/airportAnalysis/transitionSurfaceCal1", // 过渡面1计算(左)
        transitionSurfaceCal2: (flag ? IP.online : IP.offline) + "/airportAnalysis/transitionSurfaceCal2", // 过渡面1计算(右)
        approachSurfaceCal3D: (flag ? IP.online : IP.offline) + "/airportAnalysis/approachSurfaceCal3D", // 进近面计算
        innerHorizontalSurfaceCal3D: (flag ? IP.online : IP.offline) + "/airportAnalysis/innerHorizontalSurfaceCal3D", // 内水平面计算
        takeoffClimbingSurfaceCal3D: (flag ? IP.online : IP.offline) + "/airportAnalysis/takeoffClimbingSurfaceCal3D", // 起飞爬升面计算
        taperedSurfaceCal3D: (flag ? IP.online : IP.offline) + "/airportAnalysis/taperedSurfaceCal3D", // 锥形面计算
        transitionSurfaceCal13D: (flag ? IP.online : IP.offline) + "/airportAnalysis/transitionSurfaceCal13D", // 过渡面1计算(左)
        transitionSurfaceCal23D: (flag ? IP.online : IP.offline) + "/airportAnalysis/transitionSurfaceCal23D", // 过渡面1计算(右)
    },
    synAnalysis:{
        getWindyChangeFaceData: (flag ? IP.online : IP.offline) + "/synAnalysis/getWindyChangeFaceData"
    },
    scenarioFile:{
        getRoute:(flag ? IP.online : IP.offline) + "/scenarioFile/getRoute", // 获取路线库
        uploadRoute:(flag ? IP.online : IP.offline) + "/scenarioFile/uploadRoute", // 上传路线库
    }
}

export default path