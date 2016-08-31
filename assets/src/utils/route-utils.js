import PubSubMsg from './pubsubmsg';

export function startFetchingComponent() {
    PubSubMsg.publish('start-fetching-component');
}

export function endFetchingComponent() {
    PubSubMsg.publish('end-fetching-component');
}

/**
 * 根据地址栏判断是否应该渲染组件
 * @param nextState
 * @returns {boolean}
 */
export function shouldComponentMount(nextState) {
    return window.location.pathname === nextState.location.pathname;
}
