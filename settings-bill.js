const moment = require("moment");
module.exports = SettingsBill = () => {
    let smsCost = 0;
    let callCost = 0;
    let warningLevel = 0;
    let criticalLevel = 0;

    let actionList = [];

    const setSettings = (settings) => {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = Number(settings.warningLevel);
        criticalLevel = Number(settings.criticalLevel);
    }

    const getSettings = () => {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }

    const recordAction = (action) => {
        let cost = 0;
        if (action === 'sms') {
            cost = smsCost;
        }
        else if (action === 'call') {
            cost = callCost;
        }

        actionList.push({
            type: action,
            cost,
            timestamp: moment(new Date()).fromNow()
        });
    }
    const actions = () => actionList
    const actionsFor = (type) => {
        const filteredActions = [];
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            if (action.type === type) {
                filteredActions.push(action);
            }
        }
        return filteredActions;
    }

    const getTotal = (type) => {
        let total = 0;
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            if (action.type === type) {
                total += action.cost;
            }
        }
        return total;
    }

    const grandTotal = () => getTotal('sms') + getTotal('call');

    const totals = () => {
        let smsTotal = getTotal('sms')
        let callTotal = getTotal('call')
        return {
            smsTotal,
            callTotal,
            grandTotal: grandTotal()
        }
    }

    const hasReachedWarningLevel = () => {
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel
            && total < criticalLevel;
        return reachedWarningLevel;
    }

    const hasReachedCriticalLevel = () => {
        const total = grandTotal();
        return total >= criticalLevel;
    }

    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel
    }
}