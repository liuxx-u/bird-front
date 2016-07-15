/**
 * Created by Administrator on 2016/6/24.
 */
import {BodeTools} from '../../../../assets/js/bode/bode';

const DateRender=function(v,d){
    return BodeTools.timeFormat(v,"yyyy-MM-dd");
};

const DateTimeRender=function(v,d){
    return BodeTools.timeFormat(v,"yyyy-MM-dd hh:mm");
};

const TimeRender=function(v,d){
    return BodeTools.timeFormat(v,"HH:mm:ss");
};

const SwitchRender=function(v,d){
    return v?'是':'否';
};

export {DateRender,DateTimeRender,TimeRender,SwitchRender}
