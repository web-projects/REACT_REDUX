import { expect } from 'chai';
import moment from 'moment';
import DateHelper from '../../../../core/utils/dateHelper';

describe('DateHelper', () => {
  const dateTimeFormat = 'MMMM Do YYYY, h:mm:ss a';
  const morning = 'morning';
  const afternoon = 'afternoon';
  const evening = 'evening';

  const partOfDay = (t) => `January 15th 2020, ${t}`;

  context('getGreetingTimeOfDay', () => {
    it('should return morning when the time is 12:00am', () => {
      const sampleMoment = moment(partOfDay('12:00:00 am'), dateTimeFormat);
      expect(DateHelper.getGreetingTimeOfDay(sampleMoment)).to.equal(morning);
    });

    it('should return morning when the time is 11:59am', () => {
      const sampleMoment = moment(partOfDay('11:59:59 am'), dateTimeFormat);
      expect(DateHelper.getGreetingTimeOfDay(sampleMoment)).to.equal(morning);
    });

    it('should return afternoon when the time is 12:00pm', () => {
      const sampleMoment = moment(partOfDay('12:00:00 pm'), dateTimeFormat);
      expect(DateHelper.getGreetingTimeOfDay(sampleMoment)).to.equal(afternoon);
    });

    it('should return afternoon when the time is 5:59pm', () => {
      const sampleMoment = moment(partOfDay('5:59:59 pm'), dateTimeFormat);
      expect(DateHelper.getGreetingTimeOfDay(sampleMoment)).to.equal(afternoon);
    });

    it('should return evening when the time is 6:00pm', () => {
      const sampleMoment = moment(partOfDay('6:00:00 pm'), dateTimeFormat);
      expect(DateHelper.getGreetingTimeOfDay(sampleMoment)).to.equal(evening);
    });

    it('should return evening when the time is 11:59pm', () => {
      const sampleMoment = moment(partOfDay('11:59:59 pm'), dateTimeFormat);
      expect(DateHelper.getGreetingTimeOfDay(sampleMoment)).to.equal(evening);
    });
  });
});
