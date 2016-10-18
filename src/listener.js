class Util {
    constructor() {
        this.handlers = {}
    }

    publish(EventName, ...Params) {
        try {
            const $self = this,
                  { ev, className } = this.RegAnalyse(EventName);
            
            if(!this.isHas(ev, className)) {
                return;
            }

            if (className) {
                this.handlers[ev][className].forEach(value => value.apply($self, Params))
            } else {
                for (let i of Object.keys(this.handlers[ev])) {
                    this.handlers[ev][i].forEach(value => value.apply($self, Params))
                }
            }

        } catch (e) {
            throw new Error(e);
        }

        return this;
    }

    once(EventName, ...Params) {
        this.publish(EventName, ...Params);
        this.unsubscribe(EventName);
    }

    subscribe(EventName, callback) {
        this.isString(EventName);

        let {ev, className} = this.RegAnalyse (EventName);

        if (!ev) {
            throw new Error(`listenerName must only combine with only character、number and _  `)
        }

        if (/^default$/.test(className)) {
            throw new Error(`default eventClass was binded !`);
            return;
        }

        !(ev in this.handlers) && (this.handlers[ev] = {default: []})
        
        className ?
        (this.handlers[ev][className] ? 
        this.handlers[ev][className].push(callback) :
        this.handlers[ev][className] = [callback]) :
        this.handlers[ev].default.push(callback);

        return this;
    }

    unsubscribe(EventName) {
        this.isString(EventName);

        let {ev, className} = this.RegAnalyse (EventName);

        if(!this.isHas(ev, className)) {
            return;
        };
        
        className ?
        delete this.handlers[ev][className] :
        delete this.handlers[ev]

        return this;
    }

    isHas (ev, className) {
        if (
            !(ev in this.handlers) ||
            (className && !(className in this.handlers[ev]))
        ) {
            throw new Error(`The Event didnt bind !`);
            return false;
        } else {
            return true;
        }
    }

    RegAnalyse (EventName) {
        const regResult = /^(\w+)(\.(\w+))?$/.exec(EventName),
              ev        = regResult[1],
              className = regResult[3];
        
        return { className, ev }
    }

    isString(EventName) {
        if (typeof(EventName) !== `string`) {
            throw new Error(`EventName must is a string !`)
            return;
        }
    }
}

module.exports = Util;
// export default Util;