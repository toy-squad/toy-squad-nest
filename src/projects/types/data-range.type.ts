export class DateRange {
    startDate: Date;
    endDate: Date;
  
    constructor(startDate: Date, endDate: Date) {
      this.startDate = startDate;
      this.endDate = endDate;
    }
  
    /**
     * 특정 날짜가 이 날짜 범위 내에 있는지 확인
     */
    includes(date: Date): boolean {
      return date >= this.startDate && date <= this.endDate;
    }
  
    /**
     * 날짜 범위의 유효성을 검증
     * 시작 날짜가 종료 날짜보다 이전
     */
    isValid(): boolean {
      return this.startDate <= this.endDate;
    }
  
    /**
     * 날짜 범위의 길이를 일(days) 단위로 반환
     */
    lengthInDays(): number {
      const diff = this.endDate.getTime() - this.startDate.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
  }
  