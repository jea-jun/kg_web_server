##dfdfdfdfdfd



import cv2
import numpy as np

def nothing(x):
    pass

# 카메라 캡처 설정
cap = cv2.VideoCapture(0)

cv2.namedWindow('Color Detector', cv2.WINDOW_NORMAL)

# 트랙바 생성
cv2.createTrackbar('Low H', 'Color Detector', 0, 179, nothing)
cv2.createTrackbar('Low S', 'Color Detector', 0, 255, nothing)
cv2.createTrackbar('Low V', 'Color Detector', 0, 255, nothing)

cv2.createTrackbar('High H', 'Color Detector', 179, 179, nothing)
cv2.createTrackbar('High S', 'Color Detector', 255, 255, nothing)
cv2.createTrackbar('High V', 'Color Detector', 255, 255, nothing)

while True:
    _, frame = cap.read()
    
    if frame is None:
        break

    # 트랙바 위치 가져오기
    low_h = cv2.getTrackbarPos('Low H', 'Color Detector')
    low_s = cv2.getTrackbarPos('Low S', 'Color Detector')
    low_v = cv2.getTrackbarPos('Low V', 'Color Detector')
    
    high_h = cv2.getTrackbarPos('High H', 'Color Detector')
    high_s = cv2.getTrackbarPos('High S', 'Color Detector')
    high_v = cv2.getTrackbarPos('High V', 'Color Detector')

    # 1. 색상 모델 변환 (BGR에서 HSV로 변환)
    frame_hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # 2. 색상 영역 추출
    lower_color = np.array([low_h, low_s, low_v])
    upper_color = np.array([high_h, high_s, high_v])
    mask = cv2.inRange(frame_hsv, lower_color, upper_color)

    # 노이즈 제거를 위한 모폴로지 연산 적용
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

    # 3. 윤곽선 추출
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if contours:
        max_contour = max(contours, key=cv2.contourArea)
        if cv2.contourArea(max_contour) > 100:
            cv2.drawContours(frame, [max_contour], -1, (0, 255, 0), 2)

            # 윤곽선의 무게 중심 계산
            M = cv2.moments(max_contour)
            if M["m00"] != 0:
                cx = int(M["m10"] / M["m00"])
                cy = int(M["m01"] / M["m00"])

                # 추적된 위치에 원 그리기
                cv2.circle(frame, (cx, cy), 20, (0, 255, 0), -1)

    # 4. 결과 표시
    result = cv2.bitwise_and(frame, frame, mask=mask)
    hsv_values = [lower_color, upper_color]

    cv2.imshow('Original Image', frame)
    cv2.imshow('Color Detector', result)

    key = cv2.waitKey(10) & 0xFF
    if key == 27:  # Esc 키를 눌러 종료
        break
    elif key == ord('s'):  # 's' 키를 눌러 HSV 값 저장
        np.save("hsv_value.npy", hsv_values)
        print("HSV 값이 저장되었습니다.")

cap.release()
cv2.destroyAllWindows()


##sdsds