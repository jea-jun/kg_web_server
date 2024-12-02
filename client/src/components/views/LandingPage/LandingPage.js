import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import { category, decadeRanges } from './Sections/Datas';
import SearchFeature from './Sections/SearchFeature';
import './Sections/LandingPage.css';

const { Meta } = Card;

function LandingPage() {
    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState();
    const [SearchTerms, setSearchTerms] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState({ date: '', time: '' });
    const [Filters, setFilters] = useState({ category: [], decadeRanges: [] });
    const [showReservationForm, setShowReservationForm] = useState(null); // 예약 입력창을 표시할 카드 상태
    const [isReserved, setIsReserved] = useState([]); // 예약 여부 상태

    useEffect(() => {
        const variables = {
            pageno: Skip,
            displaylines: Limit,
        };
        getProducts(variables);
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    // 서버에서 제품 정보 받아오기
    const getProducts = (variables) => {
        Axios.get('/api/book/getBooks', { params: variables })
            .then(response => {
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
                                    .replace(/\s*\/\s*$/, '')
                                    .trim(),
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
                console.error("API 요청 오류:", error.message || error);
                alert('An error occurred while fetching data. Please try again later.');
                setProducts([]);
            });
    };

    // 예약 날짜와 시간 서버로 전송
    const sendDateTimeToServer = (bookControlNumber) => {
        const { date, time } = selectedDateTime;

        if (!date || !time) {
            alert("날짜와 시간을 모두 입력해주세요.");
            return;
        }

        const payload = { date, time, controlNumber: bookControlNumber };

        Axios.post('/api/robot/DateTime', payload)
            .then((response) => {
                if (response.data.success) {
                    console.log("DateTime sent successfully:", response.data);
                    alert("날짜와 시간이 성공적으로 전송되었습니다.");
                    setIsReserved((prevReserved) => [...prevReserved, bookControlNumber]); // 예약된 카드로 상태 업데이트
                    setShowReservationForm(null); // 예약 후 입력폼 숨기기
                } else {
                    console.error("Failed to send DateTime:", response.data.message);
                    alert("전송에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("Error sending DateTime:", error.message);
                alert("서버 전송 중 오류가 발생했습니다.");
            });
    };

    // 외부 클릭 감지 핸들러
    const handleOutsideClick = (e) => {
        if (!e.target.closest('.card')) {
            setSelectedCard(null); // 외부를 클릭하면 선택 해제
        }
    };

    // 카드 클릭 시 예약 입력 폼을 토글
    const toggleReservationForm = (bookControlNumber) => {
        if (showReservationForm === bookControlNumber) {
            setShowReservationForm(null); // 이미 보이면 숨김
        } else {
            setShowReservationForm(bookControlNumber); // 아니면 해당 카드 예약 입력창 보이기
        }
    };

    // 카드 렌더링
    const renderCards = Products.map((product, index) => {
        const isCardReserved = isReserved.includes(product.controlNumber); // 해당 카드가 예약되었는지 확인

        return (
            <Col key={index} lg={6} md={8} xs={24}>
                <Card
                    className={`card ${selectedCard === index ? 'card-selected' : ''}`}
                    hoverable={true}
                    onClick={(e) => {
                        e.stopPropagation(); // 이벤트 버블링 방지
                        setSelectedCard(index === selectedCard ? null : index); // 카드 선택/해제
                    }}
                    cover={<div>{product.controlNumber}</div>}
                >
                    <Meta
                        title={product.title}
                        description={
                            <div>
                                <p>Author: {product.author}</p>
                                <p>Year: {product.publishYear}</p>
                                <p>Contents: {product.contents}</p>
                            </div>
                        }
                    />

                    {/* 예약된 카드에 '예약됨' 텍스트 표시 */}
                    {isCardReserved && (
                        <div className="reservation-status">예약됨</div>
                    )}

                    {/* 예약 입력 폼, 예약되지 않은 카드에서만 보이도록 */}
                    {showReservationForm === product.controlNumber && !isCardReserved && (
                        <div
                            className="time-picker-container"
                            onClick={(e) => e.stopPropagation()} // 부모로 이벤트 전파 방지
                        >
                            <label>
                                Date:
                                <input
                                    type="date"
                                    value={selectedDateTime.date || ''}
                                    onChange={(e) => {
                                        const value = e.target.value; // 즉시 값 저장
                                        setSelectedDateTime((prev) => ({
                                            ...prev,
                                            date: value,
                                        }));
                                    }}
                                    className="date-input"
                                />
                            </label>
                            <label>
                                Time:
                                <input
                                    type="time"
                                    value={selectedDateTime.time || ''}
                                    onChange={(e) => {
                                        const value = e.target.value; // 즉시 값 저장
                                        setSelectedDateTime((prev) => ({
                                            ...prev,
                                            time: value,
                                        }));
                                    }}
                                    className="time-input"
                                />
                            </label>
                            <button
                                onClick={() => sendDateTimeToServer(product.controlNumber)} // 해당 카드 제어번호 전송
                                className="reservation-button"
                            >
                                예약하기
                            </button>
                        </div>
                    )}
                </Card>
            </Col>
        );
    });

    // 필터 및 검색 기능
    const showFilteredResults = (filters) => {
        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters
        };
        getProducts(variables);
        setSkip(0);
    };

    const handleFilters = (filters, category) => {
        const newFilters = { ...Filters };
        newFilters[category] = filters;
        showFilteredResults(newFilters);
        setFilters(newFilters);
    };

    const updateSearchTerms = (newSearchTerm) => {
        const variables = {
            pageno: 1,
            displaylines: 12,
            search: `${category[Filters.category].name}, ${newSearchTerm}`
        };
        setSkip(0);
        setSearchTerms(newSearchTerm);
        getProducts(variables);
    };

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>지식의 공간 <Icon type="rocket" /></h2>
            </div>

            {/* Search */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem auto' }}>
                <SearchFeature refreshFunction={updateSearchTerms} />
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem auto' }}>
                <Row gutter={[16, 16]}>
                    <Col lg={12} xs={24}>
                        {/* 필터 항목들 */}
                    </Col>
                </Row>
            </div>

            {/* 제품 목록 */}
            {Products.length === 0 ? (
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>No book yet...</h2>
                </div>
            ) : (
                <div>
                    <Row gutter={[16, 16]}>
                        {renderCards}
                    </Row>
                </div>
            )}

            <br /><br />

            {PostSize >= Limit && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={() => setSkip(Skip + Limit)}>Load More</button>
                </div>
            )}
        </div>
    );
}

export default LandingPage;
