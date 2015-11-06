function AgentStatus(status) {
    if (status == 0) {
        return "正常";
    } else if (status == 1) {
        return "待验证";
    } else if (status == 2) {
        return "暂停";
    }else{
        return "关闭";
    }
}