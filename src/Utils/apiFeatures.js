class ApiFeatures {


    constructor(mongooseQuery, queryString) {

        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;

    };



    Pagination() {

        // 1- Pagination

        let Page = Number((this.queryString.page)) > 0 ? Number((this.queryString.page)) : 1;
        let Limit = Number((this.queryString.limit)) > 0 ? Number((this.queryString.limit)) : 5;
        let Skip = Number((Page - 1) * Limit);

        this.page = Page;

        this.mongooseQuery.limit(Limit).skip(Skip);


        return this;

    };



    Sort() {

        // 2- Sort

        if (this.queryString.sort) {

            let Value_Of_Query_Sort = (this.queryString.sort).split(",").join(" ");
            this.mongooseQuery.sort(Value_Of_Query_Sort);

        } else {

            this.mongooseQuery.sort("-createdAt");

        };

        return this;

    };



    Select() {


        // 3- Select

        if (this.queryString.select) {

            let Value_Of_Query_Select = (this.queryString.select).split(",").join(" ");
            this.mongooseQuery.select(Value_Of_Query_Select);

        };


        return this;

    };



    Search() {


        // 4- Search

        if (this.queryString.keyword) {

            this.mongooseQuery.find({
                $or: [

                    { name: { $regex: (this.queryString.keyword), $options: "i" } },
                    { description: { $regex: (this.queryString.keyword), $options: "i" } }

                ]
            });

        };


        return this;

    };



    Filter() {

        // 5- Filter

        let Querys = { ...this.queryString };
        let Query_Not_Use = ["page", "limit", "select", "keyword", "sort"];
        let SchemaObj = [];

        if (this.mongooseQuery.schema.obj) {

            for (let value in this.mongooseQuery.schema.obj) {

                SchemaObj.push(value);

            };

        };


        for (let query in Querys) {

            if (!SchemaObj.includes(query)) {

                delete Querys[query];

            };

        };


        Query_Not_Use.forEach((query) => {

            delete Querys[query];

        });


        Querys = JSON.stringify(Querys);
        Querys = Querys.replace(/(gt|gte|lt|lte)/g, (match) => {

            return `$${match}`;

        });

        Querys = JSON.parse(Querys);

        this.mongooseQuery.find(Querys);

        return this;

    };

};


export default ApiFeatures;