/*
   * Use bindTo to allow dynamic drag of markers to refresh poly.
   */

export default function MVCArrayBinder(mvcArray) {
    this.array_ = mvcArray;
}
MVCArrayBinder.prototype = new google.maps.MVCObject();
MVCArrayBinder.prototype.get = function (key) {
    if (!isNaN(parseInt(key))) {
        return this.array_.getAt(parseInt(key));
    } else {
        this.array_.get(key);
    }
}
MVCArrayBinder.prototype.set = function (key, val) {
    if (!isNaN(parseInt(key))) {
        this.array_.setAt(parseInt(key), val);
    } else {
        this.array_.set(key, val);
    }
}