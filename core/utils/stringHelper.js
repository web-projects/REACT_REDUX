export default class StringHelper {
    static toProperCase = (sentence) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      sentence.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
