import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import { category, decadeRanges } from './Sections/Datas';
import SearchFeature from './Sections/SearchFeature';
import { handleCardClick, handleDateChange, handleTimeChange, handleReservation, handleOutsideClick } from './Sections/ReservationButton';
import './Sections/LandingPage.css';

const { Meta } = Card;

function LandingPage() {
    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState()
    const [SearchTerms, setSearchTerms] = useState("")
    const [selectedCard, setSelectedCard] = useState(null);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

    const [Filters, setFilters] = useState({
        category: [],
        decadeRanges: []
    })

    useEffect(() => {
        
                const variables = {
                    pageno: Skip,
                    displaylines: Limit,
                }
        
                getProducts(variables)
                document.addEventListener('click', handleOutsideClick);
                return () => {
                document.removeEventListener('click', handleOutsideClick);
            };
    }, [])

    const getProducts = (variables) => {
        // GET 요청 시에는 params로 쿼리 파라미터를 전달
        Axios.get('/api/book/getBooks', { params: variables })
            .then(response => {
                // 서버에서 데이터를 받아오는 로직
                let xmlData = response.data.data;

                // XML 데이터가 문자열일 때만 파싱 수행
                if (typeof xmlData === 'string' && xmlData.startsWith('<?xml')) {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

                    const records = xmlDoc.getElementsByTagName("recode");
                    if (records.length > 0) {
                        const products = Array.from(records).map(record => {
                            const items = record.getElementsByTagName("item");
                            const getValueByName = (name) => {
                                for (let i = 0; i < items.length; i++) {
                                    const nameElement = items[i].getElementsByTagName("name")[0];
                                    if (nameElement && nameElement.textContent === name) {
                                        return (items[i].getElementsByTagName("value")[0].textContent || '').trim();
                                    }
                                }
                                return '';
                            };
                            return {
                                controlNumber: getValueByName("제어번호"),
                                author: getValueByName("저자명").trim(),
                                contents: getValueByName("목차").trim(),
                                publishYear: getValueByName("발행년도").trim(),
                                title: (getValueByName("자료명") || getValueByName("기사명") || getValueByName("저널명") || getValueByName("수록지명"))
        .replace(/\s*\/\s*$/, '') // 끝에 오는 '/' 제거
        .trim(), // 공백 제거
                            };
                        });
                        setProducts(products);
                    } else {
                        console.error("No records found in the XML response");
                        setProducts([]);
                    }
                } else {
                    console.error("Received data is not valid XML:", response.data);
                    setProducts([]);
                }
            })
            .catch(error => {
                console.error("API 요청 오류:", error.message || error); // 오류 로그 출력
                alert('An error occurred while fetching data. Please try again later.');
                setProducts([]);
            });
    };

    
    const onLoadMore = () => {
        let skip = Skip + Limit;

        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters,
            searchTerm: SearchTerms
        }
        getProducts(variables)
        setSkip(skip)
    }

    const renderCards = Products.map((product, index) => {
        return (
            <Col key={index} lg={6} md={8} xs={24}>
                <Card
                    className={selectedCard === index ? 'card-selected' : ''}
                    hoverable={true}
                    onClick={(e) => {
                        e.stopPropagation(); // 이벤트 버블링 방지
                        handleCardClick(index, setSelectedCard, setIsTimePickerVisible);
                    }}
                    cover={<div>{index}</div>}
                >
                    <Meta
                        title={product.title}
                        description={
                            <div>
                                <p>Author: {product.author}</p>
                                <p>Year: {product.publishYear}</p>
                                <p>Control Number: {product.controlNumber}</p>
                                <p>Contents: {product.contents}</p>
                            </div>
                        }
                    />
    
                    {/* 시간 선택 창 */}
                    {selectedCard === index && (
                        <div className="time-picker-container">
                            <label>
                                Date:
                                <input
                                    type="date"
                                    value={selectedDateTime.date}
                                    onChange={(e) => handleDateChange(e, selectedDateTime, setSelectedDateTime)}
                                    className="date-input"
                                />
                            </label>
                            <label>
                                Time:
                                <input
                                    type="time"
                                    value={selectedDateTime.time}
                                    onChange={(e) => handleTimeChange(e, selectedDateTime, setSelectedDateTime)}
                                    className="time-input"
                                />
                            </label>
                            <button
                                onClick={() => handleReservation(selectedDateTime, setIsTimePickerVisible)}
                                className="reservation-button"
                            >
                                Reserve
                            </button>
                        </div>
                    )}
                </Card>
            </Col>
        );
    });
    


    const showFilteredResults = (filters) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters

        }
        getProducts(variables)
        setSkip(0)

    }

    const handledecadeRanges = (value) => {
        const data = decadeRanges;
        let array = [];

        for (let key in data) {

            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        console.log('array', array)
        return array
    }

    const handleFilters = (filters, category) => {

        const newFilters = { ...Filters }

        newFilters[category] = filters

        if (category === "decadeRanges") {
            let decadeRangesValues = handledecadeRanges(filters)
            newFilters[category] = decadeRangesValues

        }

        console.log(newFilters)

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerms = (newSearchTerm) => {

        const variables = {
            pageno: 1,
            displaylines: 12,
            search: `${category[Filters.category].name}, ${newSearchTerm}`

        }

        setSkip(0)
        setSearchTerms(newSearchTerm)

        getProducts(variables)
    }


    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2> 지식의 공간 <Icon type="rocket" />  </h2>
            </div>

            
            {/* Search  */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem auto' }}>

                <SearchFeature
                    refreshFunction={updateSearchTerms}
                />

            </div>


            {/* Filter  */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem auto' }}>
                <Row gutter={[16, 16]}>
                    <Col lg={12} xs={24} >
                        <CheckBox
                            list={category}
                            handleFilters={filters => handleFilters(filters, "category")}
                        />
                    </Col>
                    <Col lg={12} xs={24}>
                        <RadioBox
                            list={decadeRanges}
                            handleFilters={filters => handleFilters(filters, "decadeRanges")}
                        />
                    </Col>
                </Row>
            </div>



            {Products.length === 0 ?
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>No book yet...</h2>
                </div> :
                <div>
                    <Row gutter={[16, 16]}>

                        {renderCards}

                    </Row>


                </div>
            }
            <br /><br />

            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
            }


        </div>
    )
}

export default LandingPage
