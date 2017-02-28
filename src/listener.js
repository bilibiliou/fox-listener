const $handlers_key = Symbol('$handlers_key');

class Util {
    constructor(...params) {
        let obj = params[0];
        let self = this;

        this[$handlers_key] = {};

        if(obj) {
            switch (self.testType(obj)) {
                case '[object Object]': 
                    return Object.assign(self, obj);
                break;
            }    
        }
    }

    testType(t) {
         return Object.prototype.toString.call(t)   
    }

    publish(EventName, ...Params) {
        try {
            const $self = this,
                  {ev, className } = this.RegAnalyse(EventName);
            
            if(!this.isHas(ev, className)) {
                return;
            }

            if (className) {
                this[$handlers_key][ev][className].forEach(value => value.apply($self, Params))
            } else {
                for (let i of Object.keys(this[$handlers_key][ev])) {
                    this[$handlers_key][ev][i].forEach(value => value.apply($self, Params))
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

        !(ev in this[$handlers_key]) && (this[$handlers_key][ev] = {default: []})
        
        className ?
        (this[$handlers_key][ev][className] ? 
        this[$handlers_key][ev][className].push(callback) :
        this[$handlers_key][ev][className] = [callback]) :
        this[$handlers_key][ev].default.push(callback);

        return this;
    }

    unsubscribe(EventName) {
        this.isString(EventName);

        let {ev, className} = this.RegAnalyse (EventName);

        if(!this.isHas(ev, className)) {
            return;
        };
        
        className ?
        delete this[$handlers_key][ev][className] :
        delete this[$handlers_key][ev]

        return this;
    }

    isHas (ev, className) {
        if (
            !(ev in this[$handlers_key]) ||
            (className && !(className in this[$handlers_key][ev]))
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

    find(key) {
        let self = this;
        let oPath = [];

        if (self.testType(key) !== '[object String]') {
            console.error('params must be string!');
            return;
        }

        let sclass = key.split('.');
        // .map((t,i) => {
        //     let reg = /^(\w*)\[(\d+)\]$/;
        //     if (reg.test(t)) {
        //         return reg.exec(t).slice(1,3);
        //     } else {
        //         return t;
        //     }
        // })

        let $p = null;
        let $c = null;

        try {
            if (sclass.length > 1) {
                sclass.reduce((b,n) => {
                    if (b.hasOwnProperty(n)) {
                        $p = b;
                        $c = n;

                        return b[n];
                    } else {
                        throw Error('Doesnt find this property! Please cleck this property name was right!');
                    }
                }, self);
            } else {
                $p = self;
                $c = sclass[0];
            }
        } catch(err) {
            console.error(err);
        }
        return {$p, $c};
    }

    bindSetterandGetter(parent, key, callback, getter) {
        let $value = parent[key];
        Object.defineProperty(parent, key, {
            get: function bindGetter() {
                return getter ? getter.call(this, $value) : $value;
            },
            
            set: function bindSetter(param) {
                $value = callback ? callback.call(this, param) : param;
            }
        })
    }

    watch(key, opt, callback, getter) {
        let self = this;
        let isDeep = opt.deep;
        let {$p, $c} = this.find(key);
        
        if(isDeep) {
            let pcType = self.testType($p[$c])
            if (pcType === '[object Object]' || pcType === '[object Array]') {

                self.tree($p[$c], (traceObj, i, callback, getter) => {
                    self.bindSetterandGetter(traceObj, i, callback, getter);
                }, callback, getter)
            } else {
                console.error('deep-bind root must is a object or array')
            }
        } else {
            self.bindSetterandGetter($p, $c, callback, getter);
        }
    }

    tree(obj, treeCallback, fn1, fn2) {
        let self = this;
        for(let i in obj) {
            let Type = self.testType(obj[i]);
            if(Type === '[object Object]' || Type === '[object Array]') {
                self.tree(obj[i], treeCallback,fn1, fn2);
            }
            treeCallback(obj, i, fn1, fn2);
        }
    }
}

module.exports = Util;
// export default Util;