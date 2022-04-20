export default class DateHelper {
  static getGreetingTimeOfDay(m) {
    if (!m || !m.isValid()) {
      return '';
    }

    const cutoffAfternoon = 12; // 24hr time to split the afternoon.
    const cutoffEvening = 17; // 24hr time to split the evening.
    const currentHour = parseFloat(m.format('HH'));

    if (currentHour >= cutoffAfternoon && currentHour <= cutoffEvening) {
      return 'afternoon';
    } if (currentHour >= cutoffEvening) {
      return 'evening';
    }
    return 'morning';
  }
}
