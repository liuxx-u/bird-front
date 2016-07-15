import React from 'react';

const render = function() {
    let totalCount=this.props.options.totalCount;
    let uiPagedCount=this.props.options.displayPagedCount||5;
    let cIndex=this.props.options.curIndex||1;
    let pageSize=this.props.options.pageSize||15;

    let pageCount = Math.ceil(totalCount / pageSize);
    let halfUiPagedCount=Math.floor(uiPagedCount/2);
    let gIndex=pageCount;
    if (!(pageCount <= uiPagedCount || pageCount - halfUiPagedCount <= cIndex)) {
        gIndex = cIndex <= halfUiPagedCount ? uiPagedCount : cIndex + halfUiPagedCount;
    }

    let pageArr=[];
    for (let i = gIndex > uiPagedCount ? gIndex - (uiPagedCount-1) : 1; i <= gIndex; i++) {
        pageArr.push(i);
    }

    let propPageClick=this.props.options.pageClick;
    let pageClick=function (pageIndex) {
        if (pageIndex > 0 && pageIndex != cIndex && pageIndex <= pageCount) {
            propPageClick(pageIndex);
        }
    }

    let propPageSizeChange=this.props.options.pageSizeChange;
    let pageSizeChange=function (e) {
        propPageSizeChange(e.target.value);
    }

    let uiLi=pageArr.map(function (i) {
        let className=i==cIndex?"active":"";
        return <li key={"page_"+i} className={className} onClick={pageClick.bind(this,i)}><a href="#">{i}</a></li>;
    });

    let preClassName="prev";
    if(cIndex==1){
        preClassName =" disabled";
    }

    let nextClassName="next";
    if(pageCount==0||cIndex==pageCount){
        nextClassName =" disabled";
    }

    return (
        <div className="row">
            <div className="col-md-5 col-sm-12">
                <div style={{paddingTop:"10px"}}>
                    <select value={pageSize} onChange={pageSizeChange}>
                        <option value="1">1</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select> 每页，总计{totalCount}条记录
                </div>
            </div>
            <div className="col-md-7 col-sm-12">
                <div style={{textAlign:"right"}}>
                    <ul className="pagination">
                        <li className={preClassName} onClick={pageClick.bind(this,1)}>
                            <a href="#">
                                <i className="fa fa-angle-double-left"></i>
                            </a>
                        </li>
                        <li className={preClassName} onClick={pageClick.bind(this,cIndex-1)}>
                            <a href="#">
                                <i className="fa fa-angle-left"></i>
                            </a>
                        </li>
                        {uiLi}
                        <li className={nextClassName} onClick={pageClick.bind(this,cIndex+1)}>
                            <a href="#">
                                <i className="fa fa-angle-right"></i>
                            </a>
                        </li>
                        <li className={nextClassName} onClick={pageClick.bind(this,pageCount)}>
                            <a href="#">
                                <i className="fa fa-angle-double-right"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default render;
