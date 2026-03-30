/**
 * 存储工具类
 */

const StorageUtil = {
    /**
     * 添加已访问事件
     * @param {string} key - 存储键名
     * @param {string|number} eventId - 事件ID
     */
    addVisitedEvent: function(key, eventId) {
        try {
            const events = this.getVisitedEvents(key);
            if (!events.includes(eventId)) {
                events.push(eventId);
                localStorage.setItem(key, JSON.stringify(events));
            }
        } catch (error) {
            console.warn('存储访问记录失败:', error);
        }
    },

    /**
     * 获取已访问事件
     * @param {string} key - 存储键名
     * @returns {Array} 已访问事件ID数组
     */
    getVisitedEvents: function(key) {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('获取访问记录失败:', error);
            return [];
        }
    },

    /**
     * 清除所有访问记录
     * @param {string} key - 存储键名
     */
    clearVisitedEvents: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('清除访问记录失败:', error);
        }
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageUtil };
} else if (typeof window !== 'undefined') {
    window.StorageUtil = StorageUtil;
}