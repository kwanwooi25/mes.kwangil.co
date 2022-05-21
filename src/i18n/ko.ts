import { DeadlineStatus, Path, WorkOrderStatus } from 'const';

/* eslint-disable import/no-anonymous-default-export */
export default {
  common: {
    appName: '생산 관리 시스템',
    cancel: '취소',
    confirm: '확인',
    close: '닫기',
    save: '저장',
    search: '검색',
    reset: '초기화',
    advancedSearch: '상세 검색',
    create: '등록',
    prev: '이전',
    next: '다음',
    createBulk: '대량등록',
    bulkCreationResult: '대량 등록 결과',
    success: '성공',
    fail: '실패',
    selectFile: '파일선택',
    downloadTemplate: '템플릿 다운로드',
    removeFile: '파일제거',
    downloadExcel: '엑셀다운',
    all: '전체',
    select: '선택',
    selectAll: '전체 선택',
    unselectAll: '전체 선택 해제',
    delete: '삭제',
    deleteAll: '전체 삭제',
    edit: '수정',
    copy: '복사',
    done: '완료',
    print: '출력',
    yearMonth: '{{year}}년 {{month}}월',
    sheetCount: '{{countString}} 매',
    weightInKg: '{{weight}} kg',
    currency: '{{value}} 원',
    yesterday: '어제',
    today: '오늘',
    tomorrow: '내일',
    weeksCount: '{{weeks}}주',
    monthsCount: '{{months}}개월',
    yearsCount: '{{years}}년',
    sheet: '원단',
    treatment: '처리',
    loadMore: '더보기',
    complete: '완료',
    showAll: '전체보기',
    lastMonth: '지난달',
    thisMonth: '이번달',
    lastYear: '지난해',
    thisYear: '올해',
    overdue: '기한 지남',
    imminent: '기한 임박',
    refresh: '새로고침',
    workOrderHistory: '작업이력',
    active: '활성',
    activate: '활성화',
    inactive: '비활성',
    inactivate: '비활성화',
    createdAt: '생성일',
    updatedAt: '최종수정일',

    account: '거래처',
    product: '제품',
    plate: '동판',
    workOrder: '작업지시',
    delivery: '출고',
    user: '사용자',

    selectedCount: '<strong>{{count}}</strong>개 선택됨',

    emailInvalid: '이메일 형식이 아닙니다.',
    listEmpty: '표시할 내용이 없습니다.',
    searchResult: '총 <strong>{{count}}</strong>건 검색됨',
    hasNoChange: '변경 사항이 없습니다.',
    shouldBeDateFormat: '올바른 날짜 형식으로 입력하세요.',

    bulkCreateSuccess: '대량 등록 성공!',
    bulkCreateFailed: '대량 등록 실패!',
  },
  nav: {
    [Path.DASHBOARD]: '대시보드',
    [Path.ACCOUNTS]: '거래처',
    [Path.PRODUCTS]: '제품',
    [Path.PLATES]: '동판',
    [Path.WORK_ORDERS]: '작업지시',
    [Path.USERS]: '사용자',
    [Path.SETTINGS]: '설정',
  },
  auth: {
    email: '이메일',
    password: '비밀번호',
    passwordConfirm: '비밀번호 확인',
    name: '이름',
    login: '로그인',
    logout: '로그아웃',
    register: '가입하기',

    emailInvalid: '이메일 형식이 아닙니다.',
    emailRequired: '이메일을 입력하세요.',
    passwordRequired: '비밀번호를 입력하세요.',
    passwordConfirmRequired: '비밀번호를 한번 더 입력하세요.',
    passwordsMustMatch: '비밀번호가 일치하지 않습니다.',
    nameRequired: '이름을 입력하세요.',
    loginSuccess: '로그인 성공!',
    loginFailed: '로그인 실패: 이메일 혹은 비밀번호를 확인하세요.',
    loginRequired: '로그인이 필요합니다.',
    signUpSuccess: '가입 요청이 전송되었습니다. 관리자의 승인을 기다려주세요.',
    signUpFailed: '가입 요청에 실패했습니다.',
  },
  dashboard: {
    pageTitle: '대시보드',
    workOrderCount: '주문내역',
    deadlineStatus: '납기현황',
    plateStatus: '동판 제작 필요 품목',

    noPlatesToProduce: '필요한 동판이 모두 제작되었습니다.',
    noWorkOrders: {
      [DeadlineStatus.OVERDUE]: '기한이 지난 작업이 없습니다.',
      [DeadlineStatus.IMMINENT]: '기한이 임박한 작업이 없습니다.',
    },
  },
  accounts: {
    pageTitle: '거래처',
    addAccount: '거래처 등록',
    updateAccount: '거래처 정보 수정',
    addContact: '연락처 추가',
    deleteAccount: '거래처 삭제',
    accountDetail: '거래처 정보',
    name: '거래처명',
    crn: '사업자등록번호',
    memo: '메모',
    accountList: '거래처목록',

    accountNameRequired: '거래처명을 입력하세요.',
    getAccountsFailed: '거래처 목록 가져오기 실패!',
    createAccountSuccess: '거래처 등록 성공!',
    createAccountFailed: '거래처 등록 실패!',
    bulkCreateAccountSuccess: '거래처 대량 등록 성공!',
    bulkCreateAccountFailed: '거래처 대량 등록 실패!',
    updateAccountSuccess: '거래처 정보 수정 성공!',
    updateAccountFailed: '거래처 정보 수정 실패!',
    deleteAccountConfirm: '<strong>{{accountName}}</strong>을(를) 정말 삭제하시겠습니까?',
    deleteAccountsConfirm: '선택하신 <strong>{{count}}개</strong> 업체를 모두 삭제하시겠습니까?',
    deleteAccountSuccess: '거래처 삭제 성공!',
    deleteAccountFailed: '거래처 삭제 실패!',
    searchPlaceholder: '거래처명으로 검색',
  },
  contacts: {
    baseContact: '기본 연락처',
    title: '연락처명',
    phone: '전화',
    fax: '팩스',
    email: '이메일',
    address: '주소',
    memo: '메모',

    titleRequired: '연락처명을 입력하세요.',
  },

  quotes: {
    pageTitle: '견적',
    createQuote: '견적 생성',
    deleteQuote: '견적 삭제',
    productName: '제품명',
    thickness: '두께',
    length: '길이(압출폭)',
    width: '너비(가공폭)',
    printColorCount: '인쇄도수',
    variableRate: '변동비',
    printCostPerRoll: '롤당 인쇄비',
    defectiveRate: '불량률',
    plateRound: '동판둘레',
    plateLength: '동판기장',
    unitPrice: '단가',
    minQuantity: '최소수량',
    plateCost: '동판비용',
    plateCount: '동판개수',
    print: '인쇄',
    printNone: '무지',

    createQuoteSuccess: '견적 생성 성공!',
    createQuoteFailed: '견적 생성 실패!',
    deleteQuoteConfirm: '견적을 정말 삭제하시겠습니까?',
    deleteQuotesConfirm: '선택하신 <strong>{{count}}개</strong> 견적을 모두 삭제하시겠습니까?',

    accountRequired: '업체를 선택하세요.',
    thicknessRequired: '두께를 입력하세요.',
    minThicknessError: '최소 두께 ({{value}}) 이상으로 입력하세요.',
    maxThicknessError: '최대 두께 ({{value}}) 이하로 입력하세요.',
    lengthRequired: '길이(압출폭)를 입력하세요.',
    minLengthError: '최소 길이 ({{value}}) 이상으로 입력하세요.',
    maxLengthError: '최대 길이 ({{value}}) 이하로 입력하세요.',
    widthRequired: '너비(가공폭)를 입력하세요.',
    minWidthError: '최소 너비 ({{value}}) 이상으로 입력하세요.',
    maxWidthError: '최대 너비 ({{value}}) 이하로 입력하세요.',
    variableRateRequired: '변동비를 입력하세요.',
    defectiveRateRequired: '불량률을 입력하세요.',
    unitPriceRequired: '단가를 입력하세요.',
    minQuantityRequired: '최소수량을 입력하세요.',
  },

  products: {
    pageTitle: '제품',
    addProduct: '제품 등록',
    updateProduct: '제품 정보 변경',
    deleteProduct: '제품 삭제',
    createOrUpdateStock: '재고 수량 변경',
    productList: '제품목록',
    baseInfo: '기본 정보',
    accountName: '거래처명',
    name: '제품명',
    productSize: '규격',
    thickness: '두께',
    length: '길이(압출폭)',
    width: '너비(가공폭)',
    productMemo: '제품 메모',
    extrusion: '압출',
    extColor: '원단 색상',
    extIsAntistatic: '대전 방지 처리',
    extMemo: '압출 메모',
    print: '인쇄',
    printColor: '인쇄 색상',
    printNone: '무지',
    printSingle: '단면',
    printDouble: '양면',
    printFrontDetail: '전면 인쇄',
    printFrontColorCount: '전면 도수',
    printFrontColor: '전면 색상',
    printFrontPosition: '전면 인쇄 위치',
    printBackDetail: '후면 인쇄',
    printBackColorCount: '후면 도수',
    printBackColor: '후면 색상',
    printBackPosition: '후면 인쇄 위치',
    printMemo: '인쇄 메모',
    cutting: '가공',
    cutPosition: '가공 위치',
    cutIsUltrasonic: '초음파 가공',
    cutIsForPowder: '가루 포장용',
    punchDetail: '펀치',
    cutPunchCount: '펀치 개수',
    cutPunchSize: '펀치 크기',
    cutPunchPosition: '펀치 위치',
    cutMemo: '가공 메모',
    packaging: '포장',
    packMaterial: '포장 방법',
    packUnit: '포장 단위',
    packCanDeliverAll: '전량 납품',
    packMemo: '포장 메모',
    images: '이미지',
    plates: '동판',
    review: '검토',
    dates: '생성/수정일',
    createdAt: '생성일',
    updatedAt: '최종수정일',
    lastOrderedAt: '최종작업일',
    balance: '재고 수량',

    searchPlaceholder: '제품명으로 검색',
    getProductsFailed: '제품 목록 가져오기 실패!',
    createProductSuccess: '제품 등록 성공!',
    createProductFailed: '제품 등록 실패!',
    bulkCreateProductSuccess: '제품 대량 등록 성공!',
    bulkCreateProductFailed: '제품 대량 등록 실패!',
    updateProductSuccess: '제품 정보 수정 성공!',
    updateProductFailed: '제품 정보 수정 실패!',
    deleteProductConfirm: '<strong>{{productName}}</strong>을(를) 정말 삭제하시겠습니까?',
    deleteProductsConfirm: '선택하신 <strong>{{count}}개</strong> 제품을 모두 삭제하시겠습니까?',
    deleteProductSuccess: '제품 삭제 성공!',
    deleteProductFailed: '제품 삭제 실패!',

    accountRequired: '거래처를 선택하세요.',
    nameRequired: '제품명을 입력하세요.',
    thicknessRequired: '두께를 입력하세요.',
    minThicknessError: '최소 두께 ({{value}}) 이상으로 입력하세요.',
    maxThicknessError: '최대 두께 ({{value}}) 이하로 입력하세요.',
    lengthRequired: '길이(압출폭)를 입력하세요.',
    minLengthError: '최소 길이 ({{value}}) 이상으로 입력하세요.',
    maxLengthError: '최대 길이 ({{value}}) 이하로 입력하세요.',
    widthRequired: '너비(가공폭)를 입력하세요.',
    minWidthError: '최소 너비 ({{value}}) 이상으로 입력하세요.',
    maxWidthError: '최대 너비 ({{value}}) 이하로 입력하세요.',
    extColorRequired: '원단 색상을 입력하세요.',

    balanceRequired: '수량을 입력하세요.',
    createOrUpdateStocksSuccess: '재고 수량 저장 성공!',
    createOrUpdateStocksFailed: '재고 수량 저장 실패!',
  },

  plates: {
    pageTitle: '동판',
    addPlate: '동판 등록',
    editPlate: '동판 수정',
    deletePlate: '동판 삭제',
    selectProducts: '사용 제품 선택',
    selectedProducts: '선택된 제품',
    searchedProducts: '검색된 제품',
    plateInfo: '동판 정보',
    id: '동판 ID',
    round: '동판 둘레',
    length: '동판 기장',
    name: '동판명',
    material: '동판 재질',
    brass: '신주',
    steel: '데스',
    location: '동판 위치',
    memo: '동판 메모',
    products: '사용 제품',
    accountName: '업체명',
    productName: '제품명',
    complete: '동판 제작 완료',

    searchPlaceholder: '동판명으로 검색',
    roundRequired: '동판 둘레를 입력하세요.',
    minRoundError: '최소 둘레 ({{value}}) 이상으로 입력하세요.',
    maxRoundError: '최대 둘레 ({{value}}) 이하로 입력하세요.',
    lengthRequired: '동판 기장을 입력하세요.',
    minLengthError: '최소 기장 ({{value}}) 이상으로 입력하세요.',
    maxLengthError: '최대 기장 ({{value}}) 이하로 입력하세요.',
    materialRequired: '동판 재질을 선택하세요.',
    createPlateSuccess: '동판 등록 성공!',
    createPlateFailed: '동판 등록 실패!',
    getPlatesFailed: '동판 목록 가져오기 실패!',
    updatePlateSuccess: '동판 정보 수정 성공!',
    updatePlateFailed: '동판 정보 수정 실패!',
    deletePlateConfirm: '<strong>{{plateTitle}}</strong>을(를) 정말 삭제하시겠습니까?',
    deletePlatesConfirm: '선택하신 <strong>{{count}}개</strong> 동판을 모두 삭제하시겠습니까?',
    deletePlateSuccess: '동판 삭제 성공!',
    deletePlateFailed: '동판 삭제 실패!',
    confirmComplete: '<strong>{{productTitle}}</strong> 동판 제작 완료 처리 하시겠습니까?',
    shouldAddPlate: '제작된 동판 정보를 등록하시겠습니까?',
  },

  workOrders: {
    pageTitle: '작업지시',
    addWorkOrder: '작업지시 등록',
    editWorkOrder: '작업지시 수정',
    deleteWorkOrder: '작업지시 삭제',
    completeWorkOrder: '작업지시 완료 등록',
    selectProduct: '제품 선택',
    orderInfo: '작업 정보',
    selectedProduct: '선택된 제품',
    searchedProducts: '검색된 제품',
    orderedAt: '주문일',
    deliverBy: '납기일',
    orderQuantity: '주문수량',
    isUrgent: '지급',
    shouldBePunctual: '납기엄수',
    plateStatus: '동판 상태',
    plateStatusNew: '동판 신규',
    plateStatusUpdate: '동판 수정',
    plateStatusConfirm: '동판 확인',
    deliveryMethod: '납품 방법',
    deliveryMethodTbd: '미정',
    deliveryMethodCourier: '택배',
    deliveryMethodDirect: '직납',
    deliveryMethodExpress: '퀵/화물',
    workMemo: '작업 참고',
    deliveryMemo: '납품 참고',
    completedAt: '완료일',
    completedQuantity: '완료수량',
    deliveredAt: '납품일',
    deliveredQuantity: '납품수량',
    workOrderStatus: {
      [WorkOrderStatus.NOT_STARTED]: '시작전',
      [WorkOrderStatus.EXTRUDING]: '압출중',
      [WorkOrderStatus.PRINTING]: '인쇄중',
      [WorkOrderStatus.CUTTING]: '가공중',
      [WorkOrderStatus.COMPLETED]: '완료',
    },
    accountName: '업체명',
    productName: '품명',
    productSize: '규격',
    productSummary: '작업내용',
    searchStartDate: '검색시작일',
    searchEndDate: '검색종료일',
    includeCompleted: '완료 품목 포함',
    workOrder: '작업지시서',
    workOrderList: '작업지시목록',
    plateIsReady: '동판 제작 완료',
    plateIsReadyMessage:
      '<p><strong>{{productName}}</strong></p><p>동판 제작 완료 하시겠습니까?</p>',
    noHistory: '작업이력이 없습니다.',

    searchPlaceholder: '제품명으로 검색',
    productRequired: '제품을 선택하세요.',
    deliverByRequired: '납기일을 입력하세요.',
    orderQuantityRequired: '주문수량을 입력하세요.',
    minOrderQuantityError: '주문수량은 {{value}} 이상으로 입력하세요.',
    completedQuantityRequired: '완료수량을 입력하세요.',
    createWorkOrderSuccess: '작업지시 등록 성공!',
    createWorkOrderFailed: '작업지시 등록 실패!',
    bulkCreateWorkOrderSuccess: '작업지시 대량 등록 성공!',
    bulkCreateWorkOrderFailed: '작업지시 대량 등록 실패!',
    updateWorkOrderSuccess: '작업지시 수정 성공!',
    updateWorkOrderFailed: '작업지시 수정 실패!',
    completeWorkOrdersSuccess: '작업 완료 등록 성공!',
    completeWorkOrdersFailed: '작업 완료 등록 실패!',
    deleteWorkOrderConfirm: '<strong>{{workOrderId}}</strong>을(를) 정말 삭제하시겠습니까?',
    deleteWorkOrdersConfirm:
      '선택하신 <strong>{{count}}개</strong> 작업지시를 모두 삭제하시겠습니까?',
    deleteWorkOrdersSuccess: '작업지시 삭제 성공!',
    deleteWorkOrdersFailed: '작업지시 삭제 실패!',
  },

  delivery: {
    pageTitle: '출고',
    deliveryDate: '출고일',
    deliveryMethod: '출고 방법',
    addDelivery: '출고 등록',
    deleteDelivery: '출고 삭제',
    deliveryConfirm: '출고 확정',

    getDeliveriesFailed: '출고 목록 가져오기 실패!',
    deleteDeliveryConfirm:
      '출고 항목 (<strong>{{productTitle}}</strong>) 을 정말 삭제하시겠습니까?',
    deleteDeliveriesConfirm: '선택하신 <strong>{{count}}개</strong> 출고를 모두 삭제하시겠습니까?',
  },

  users: {
    pageTitle: '사용자',
    deleteUser: '사용자 삭제',

    activateUserConfirm: '사용자 (<strong>{{userName}}</strong>) 를 정말 활성화하시겠습니까?',
    inactivateUserConfirm: '사용자 (<strong>{{userName}}</strong>) 를 정말 비활성화하시겠습니까?',
    deleteUserConfirm: '사용자 (<strong>{{userName}}</strong>) 를 정말 삭제하시겠습니까?',

    updateUserSuccess: '사용자 정보 수정 성공!',
    updateUserFailed: '사용자 정보 수정 실패!',
    activateUserSuccess: '사용자 활성화 성공!',
    inactivateUserSuccess: '사용자 비활성화 성공!',
    activateUserFailed: '사용자 활성화 실패!',
    inactivateUserFailed: '사용자 비활성화 실패!',
  },

  settings: {
    pageTitle: '설정',
  },
};
