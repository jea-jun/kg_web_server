
const category = [
    {
        "_id": 0,
        "name": "전체",
        "array": []
    },
    {
        "_id": 1,
        "name": "자료명",
        "array": [0, 199]
    },
    {
        "_id": 2,
        "name": "저자",
        "array": [200, 249]
    },
    {
        "_id": 3,
        "name": "출판사",
        "array": [250, 279]
    },
    {
        "_id": 4,
        "name": "키워드",
        "array": [280, 299]
    },
    {
        "_id": 5,
        "name": "청구기호",
        "array": [300, 1500000]
    },

]


const decadeRanges = [
    { _id: 1, name: "1900년도", value: "1900~1909" },
    { _id: 2, name: "1910년도", value: "1910~1919" },
    { _id: 3, name: "1920년도", value: "1920~1929" },
    { _id: 4, name: "1930년도", value: "1930~1939" },
    { _id: 5, name: "1940년도", value: "1940~1949" },
    { _id: 6, name: "1950년도", value: "1950~1959" },
    { _id: 7, name: "1960년도", value: "1960~1969" },
    { _id: 8, name: "1970년도", value: "1970~1979" },
    { _id: 9, name: "1980년도", value: "1980~1989" },
    { _id: 10, name: "1990년도", value: "1990~1999" },
    { _id: 11, name: "2000년도", value: "2000~2009" },
    { _id: 12, name: "2010년도", value: "2010~2019" },
    { _id: 13, name: "2020년도", value: "2020~2029" },
];



export {
    category,
    decadeRanges,
}