export interface QueryBuilder {
    toQueryMap: () => Map<string, string>;
    toQueryString: () => string;
}

export class QueryOptions implements QueryBuilder {
    public pageNumber: number;
    public pageSize: number;
    public sortField: string;
    public sortOrder: number;

    constructor() {
        this.pageNumber = 0;
        this.pageSize = 20;
    }

    toQueryMap() {
        const queryMap = new Map<string, string>();
        queryMap.set('page', `${this.pageNumber}`);
        queryMap.set('size', `${this.pageSize}`);
        if (this.sortField) {
          let orden = 'asc';
          switch (this.sortOrder) {
            case 1:
            orden = 'asc';
            break;
            case -1:
            orden = 'desc';
            break;
          }
            queryMap.set('sort', `${this.sortField}%2C${orden}`);
        }
        return queryMap;
    }

    toQueryString() {
        let queryString = '';
        this.toQueryMap().forEach((value: string, key: string) => {
            queryString = queryString.concat(`${key}=${value}&`);
        });
        return queryString.substring(0, queryString.length - 1);
    }
}
