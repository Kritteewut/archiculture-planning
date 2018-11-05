const radix = 10

const MVCArrayBinder = (mvcArray) => {
    this.array_ = mvcArray;
}
MVCArrayBinder.prototype = new window.google.maps.MVCObject();
MVCArrayBinder.prototype.get = function (key) {
    if (!isNaN(parseInt(key, radix))) {
        return this.array_.getAt(parseInt(key, radix));
    } else {
        this.array_.get(key);
    }
};
MVCArrayBinder.prototype.set = function (key, val) {
    if (!isNaN(parseInt(key, radix))) {
        this.array_.setAt(parseInt(key, radix), val);
    } else {
        this.array_.set(key, val);
    }
};

export default MVCArrayBinder
