import { expect } from 'chai';
import StringHelper from '../../../../core/utils/stringHelper';

describe('StringHelper', () => {
  context('toProperCase', () => {
    it('should return proper case when sentence is all lower case', () => {
      expect(StringHelper.toProperCase('apple cherry pie')).to.equal('Apple Cherry Pie');
    });

    it('should return proper case when passed upper case', () => {
      expect(StringHelper.toProperCase('APPLE CHERRY PIE')).to.equal('Apple Cherry Pie');
    });

    it('should return proper case when passed camel case', () => {
      expect(StringHelper.toProperCase('mY gOod aUnt sAlly')).to.equal('My Good Aunt Sally');
    });

    it('should return proper case when passed proper case', () => {
      expect(StringHelper.toProperCase('My Good Aunt Sally')).to.equal('My Good Aunt Sally');
    });

    it('should return proper case when passed one word', () => {
      expect(StringHelper.toProperCase('dashboards')).to.equal('Dashboards');
    });
  });
});
