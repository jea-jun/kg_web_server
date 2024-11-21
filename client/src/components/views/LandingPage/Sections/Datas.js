
const searchCriteria = [
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
        "name": "저자명",
        "array": [200, 249]
    },
    {
        "_id": 3,
        "name": "발행자",
        "array": [250, 279]
    },
    {
        "_id": 4,
        "name": "키워드",
        "array": [280, 299]
    },
    {
        "_id": 5,
        "name": "목차",
        "array": [300, 1500000]
    },
    {
        "_id": 5,
        "name": "청구기호",
        "array": [300, 1500000]
    },
]



const category = [
    {
        "_id": 1,
        "name": "소설"
    },
    {
        "_id": 2,
        "name": "비소설"
    },
    {
        "_id": 3,
        "name": "자기계발"
    },
    {
        "_id": 4,
        "name": "예술 및 디자인"
    },
    {
        "_id": 5,
        "name": "아동/청소년"
    },
    {
        "_id": 6,
        "name": "교육 및 학습"
    },
    {
        "_id": 7,
        "name": "취미/여가"
    },
    {
        "_id": 8,
        "name": "전문 서적"
    },
    {
        "_id": 9,
        "name": "종교 및 영성"
    },
    {
        "_id": 10,
        "name": "만화/그래픽 노블"
    },
    {
        "_id": 11,
        "name": "기타"
    },
]


export {
    searchCriteria,
    category
}