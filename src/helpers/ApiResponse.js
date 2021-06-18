import url from 'url';

class ApiResponse {

    
    constructor(data, page, pageCount, limit, totalCount, req) {
        this.data = data;
        this.page = page;
        this.pageCount = pageCount;
        this.limit = limit;
        this.totalCount = totalCount;       
    }
}

export default ApiResponse;