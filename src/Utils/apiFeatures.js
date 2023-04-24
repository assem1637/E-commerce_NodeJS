class ApiFeatures {


    constructor(MongooseQuery, queryString) {

        this.MongooseQuery = MongooseQuery;
        this.queryString = queryString;

    };


    Pagination() {


        // 1- Pagination

        let Page = Number(this.queryString.page) > 0 ? Number(this.queryString.page) : 1;
        let Limit = 5;
        let Skip = ((Page - 1) * Limit);

        this.page = Page;
        this.MongooseQuery.skip(Skip).limit(Limit);

        return this;

    };



    Sorting() {



        // 2- Sorting

        if (this.queryString.sort) {

            let SortBy = (this.queryString.sort).split(",").join(" ");
            this.MongooseQuery.sort(SortBy);

        } else {

            this.MongooseQuery.sort("-createdAt");

        };

        return this;

    };





    Filtration() {

        // Filtration

        let Query = { ...this.queryString };
        let Query_Not_Use = ["page", "sort", "keyword", "fields"];
        Query_Not_Use.forEach((ele) => {

            delete Query[ele];

        });


        Query = JSON.stringify(Query);
        Query = Query.replace(/(gt|gte|lt|lte)/g, (match) => {

            return `$${match}`;

        });

        Query = JSON.parse(Query);

        this.MongooseQuery.find(Query);


        return this;

    };




    SelectFields() {

        // Fields

        if (this.queryString.fields) {

            let Value_Of_Query = (this.queryString.fields).split(",").join(" ");
            this.MongooseQuery.select(Value_Of_Query);

        };

        return this;

    };



    Search() {

        // Search

        if (this.queryString.keyword) {

            this.MongooseQuery.find({ $or: [{ name: { $regex: (this.queryString.keyword), $options: "i" } }, { description: { $regex: (this.queryString.keyword), $options: "i" } }] });

        };

        return this;

    };


};



export default ApiFeatures;