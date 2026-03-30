/**
 * 历史模块 - 时间轴交互功能（完整优化版）
 */

// 导入存储工具
import { StorageUtil } from './storage.js';

// 常量定义
const STORAGE_KEY = 'zhongshan_visited_events';
const PREVIEW_DURATION = 10; // 预览时长（秒）

// 状态管理
const TimelineState = {
    currentEventId: null,
    currentVideo: null,
    isPlaying: false,
    previewTimer: null,
    visitedEvents: new Set(),
    
    // 初始化状态
    init: function() {
        this.loadVisitedEvents();
    },
    
    // 标记为已访问
    markAsVisited: function(eventId) {
        this.visitedEvents.add(eventId);
        StorageUtil.addVisitedEvent(STORAGE_KEY, eventId);
    },
    
    // 检查是否已访问
    isEventVisited: function(eventId) {
        return this.visitedEvents.has(eventId);
    },
    
    // 加载已访问事件
    loadVisitedEvents: function() {
        const events = StorageUtil.getVisitedEvents(STORAGE_KEY);
        events.forEach(id => this.visitedEvents.add(id));
    },
    
    // 清除所有访问记录
    clearVisitedEvents: function() {
        this.visitedEvents.clear();
        StorageUtil.clearVisitedEvents(STORAGE_KEY);
    }
};

// 历史事件数据（从JSON文件加载，这里为示例数据）
let timelineData = [];

/**
 * 初始化时间轴模块
 */
function initTimeline() {
    // 加载事件数据
    loadTimelineData();
    
    // 初始化状态
    TimelineState.init();
    
    // 初始化手风琴时间轴
    initAccordionTimeline();
    
    // 初始化视频控制按钮
    initVideoControls();
    
    // 初始化滚动进度指示器
    initScrollProgress();
    
    // 初始化引导提示
    initGuideHint();
    
    // 添加动画效果
    if (typeof gsap !== 'undefined') {
        addAnimations();
    }
    
    // 设置默认选中第一个事件
    if (timelineData.length > 0) {
        const firstEvent = timelineData[0];
        TimelineState.currentEventId = firstEvent.id;
        updateVideoDisplay(firstEvent);
    }
}

/**
 * 加载时间轴数据
 */
async function loadTimelineData() {
    try {
        // 尝试从JSON文件加载数据
        const response = await fetch('../data/timeline-events.json');
        if (response.ok) {
            timelineData = await response.json();
        } else {
            // 如果文件不存在，使用默认数据
            timelineData = getDefaultTimelineData();
        }
    } catch (error) {
        console.warn('无法加载时间轴数据，使用默认数据:', error);
        timelineData = getDefaultTimelineData();
    }
}

/**
 * 获取默认时间轴数据
 */
function getDefaultTimelineData() {
    return [
        {
            id: 1,
            year: "前507",
            era: "BC",
            title: "中山国立国",
            summary: "白狄族鲜虞部建立中山国，定都于中人城",
            description: "中山国由北方少数民族白狄族中的鲜虞部建立，初期定都于中人城（今河北唐县西北）。中山国地处太行山东麓，位于燕、赵、魏等强国之间，以其独特的地理位置和民族文化在战国时期占据一席之地。",
            background: "白狄族是北方少数民族的一支，长期活跃于太行山地区。在春秋战国时期，随着中原诸侯国势力的扩张，白狄族各部逐渐形成政治实体，中山国即为其中最强大的一支。",
            impact: "中山国的建立标志着北方少数民族政治力量的崛起，为战国时期的政治格局增添了新的变数。中山国的存在和发展，促进了中原文化与北方少数民族文化的交流融合。",
            tags: ["立国", "鲜虞部", "白狄族"],
            videoId: "zhongshan_founding",
            videoTitle: "中山国的建立与早期发展",
            videoPoster: "../assets/images/history/events/founding.jpg",
            thumbnail: "../assets/images/history/thumbnails/founding-thumb.jpg",
            relatedArtifacts: [
                { id: 1, name: "鲜虞族青铜器", link: "pages/thought.html#artifact1" },
                { id: 2, name: "早期陶器", link: "pages/craft.html#artifact2" }
            ],
            summaryText: "中山国的建立开启了战国时期少数民族政权的先河，展现了多元文化交融的历史画卷。",
            relatedEvents: [2, 3]
        },
        {
            id: 2,
            year: "前414",
            era: "BC",
            title: "武公即位",
            summary: "武公继位，中山国开始强盛",
            description: "武公继位后，中山国国力逐渐强盛，开始与中原诸侯国频繁交往。武公时期，中山国完善了国家制度，加强了军事力量，为后续的扩张奠定了基础。中山国青铜器制作工艺也在这一时期得到显著发展。",
            background: "武公是中山国早期的重要君主，他在位期间积极学习中原文化，引进先进的生产技术和政治制度，使中山国从游牧部落联盟逐渐转变为具有完善国家机器的政权。",
            impact: "武公的改革为中山国的强盛奠定了基础，使中山国在战国诸侯中获得一席之地。这一时期的中山国青铜器制作工艺达到新的高度，为后世留下了珍贵的文化遗产。",
            tags: ["武公", "强盛", "制度"],
            videoId: "wugong_ascension",
            videoTitle: "武公时期的政治与军事改革",
            videoPoster: "../assets/images/history/events/wugong.jpg",
            thumbnail: "../assets/images/history/thumbnails/wugong-thumb.jpg",
            relatedArtifacts: [
                { id: 3, name: "武公铜鼎", link: "pages/thought.html#artifact3" },
                { id: 4, name: "青铜兵器", link: "pages/military.html#artifact4" }
            ],
            summaryText: "武公的改革使中山国从部落联盟转变为强大的诸侯国，为后续的发展奠定了坚实基础。",
            relatedEvents: [1, 3]
        },
        {
            id: 3,
            year: "前408",
            era: "BC",
            title: "魏国入侵",
            summary: "魏将乐羊率军攻占中山国",
            description: "魏文侯派大将乐羊率军进攻中山国，经过三年苦战，最终攻占中山国都城。中山国被迫迁都至灵寿（今河北平山）。这一时期，中山国虽然失去部分领土，但保留了国家的延续性，并在随后的岁月中逐渐恢复实力。",
            background: "魏国是战国初期最强大的诸侯国之一，实行变法后国力大增。魏文侯为实现统一中原的野心，将目光投向了地处要冲的中山国。",
            impact: "魏国的入侵使中山国遭受重创，但也迫使中山国进行深刻的自我变革。在魏国统治期间，中山国吸收了中原先进文化，为后来的复兴奠定了基础。",
            tags: ["魏国", "乐羊", "灵寿"],
            videoId: "wei_invasion",
            videoTitle: "魏国入侵与中山国迁都",
            videoPoster: "../assets/images/history/events/wei-invasion.jpg",
            thumbnail: "../assets/images/history/thumbnails/wei-invasion-thumb.jpg",
            relatedArtifacts: [
                { id: 5, name: "魏式青铜器", link: "pages/thought.html#artifact5" },
                { id: 6, name: "战国兵器", link: "pages/military.html#artifact6" }
            ],
            summaryText: "魏国入侵是中山国历史上的重大挫折，但也为其后来的文化融合和制度革新提供了契机。",
            relatedEvents: [2, 4]
        }
        // 更多事件数据可以根据需要添加
    ];
}

/**
 * 初始化手风琴时间轴
 */
function initAccordionTimeline() {
    const accordionContainer = document.getElementById('accordionContainer');
    
    if (!accordionContainer) return;
    
    // 清空容器
    accordionContainer.innerHTML = '';
    
    // 生成手风琴项目
    timelineData.forEach((event, index) => {
        const accordionItem = createAccordionItem(event, index);
        accordionContainer.appendChild(accordionItem);
    });
    
    // 设置第一个手风琴项目内容区域高度
    setTimeout(() => {
        const firstContent = document.querySelector('.accordion-item.active .accordion-content');
        if (firstContent) {
            firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
        }
    }, 100);
}

/**
 * 创建手风琴项目
 */
function createAccordionItem(event, index) {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';
    accordionItem.dataset.id = event.id;
    
    // 检查是否已访问
    if (TimelineState.isEventVisited(event.id)) {
        accordionItem.classList.add('visited');
    }
    
    // 设置第一个项目为默认激活
    if (index === 0) {
        accordionItem.classList.add('active');
    }
    
    // 生成相关文物链接
    const artifactLinks = event.relatedArtifacts ? 
        event.relatedArtifacts.map(artifact => 
            `<a href="${artifact.link}" class="artifact-link" target="_blank">
                <i class="fas fa-archway"></i>${artifact.name}
            </a>`
        ).join('') : '';
    
    accordionItem.innerHTML = `
        <div class="accordion-header">
            <div class="year-badge">
                <div class="year">${event.year}</div>
                <div class="era">${event.era}</div>
            </div>
            <div class="event-info">
                <h3 class="event-title">${event.title}</h3>
                <p class="event-summary">${event.summary}</p>
            </div>
            ${event.thumbnail ? `
            <div class="thumbnail-popup">
                <img src="${event.thumbnail}" alt="${event.title}" class="thumbnail-image" loading="lazy">
            </div>
            ` : ''}
            <div class="accordion-indicator">
                <i class="fas fa-chevron-down"></i>
            </div>
        </div>
        <div class="accordion-content">
            <div class="event-details">
                <p class="event-description">${event.description}</p>
                
                <div class="event-background">
                    <div class="detail-title">历史背景</div>
                    <div class="detail-content">${event.background}</div>
                </div>
                
                <div class="event-impact">
                    <div class="detail-title">历史影响</div>
                    <div class="detail-content">${event.impact}</div>
                </div>
                
                <div class="event-tags">
                    ${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}
                </div>
                
                ${artifactLinks ? `
                <div class="related-artifacts">
                    <div class="related-artifacts-title">相关文物</div>
                    <div class="artifact-links">
                        ${artifactLinks}
                    </div>
                </div>
                ` : ''}
                
                <a href="#" class="event-link" data-id="${event.id}">
                    <i class="fas fa-play-circle"></i>
                    播放完整视频
                </a>
            </div>
        </div>
    `;
    
    // 添加事件监听
    setupAccordionItemEvents(accordionItem, event);
    
    return accordionItem;
}

/**
 * 设置手风琴项目事件监听
 */
function setupAccordionItemEvents(accordionItem, event) {
    const header = accordionItem.querySelector('.accordion-header');
    const indicator = accordionItem.querySelector('.accordion-indicator');
    const playLink = accordionItem.querySelector('.event-link');
    
    // 点击头部切换手风琴
    header.addEventListener('click', function(e) {
        // 如果点击的是指示器，只切换手风琴
        if (e.target.closest('.accordion-indicator')) {
            toggleAccordion(event.id);
        } else {
            // 点击其他区域，切换手风琴并播放视频
            toggleAccordion(event.id);
            playFullVideo(event);
        }
    });
    
    // 悬停事件 - 视频预览
    header.addEventListener('mouseenter', function() {
        startVideoPreview(event);
    });
    
    header.addEventListener('mouseleave', function() {
        stopVideoPreview();
        
        // 如果没有正在播放完整视频，恢复默认显示
        if (!TimelineState.isPlaying) {
            const currentEvent = timelineData.find(e => e.id === TimelineState.currentEventId);
            if (currentEvent) {
                updateVideoDisplay(currentEvent, false);
            }
        }
    });
    
    // 播放链接点击事件
    playLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleAccordion(event.id);
        playFullVideo(event);
    });
}

/**
 * 开始视频预览
 */
function startVideoPreview(event) {
    clearTimeout(TimelineState.previewTimer);
    
    TimelineState.previewTimer = setTimeout(() => {
        previewVideo(event);
    }, 300); // 悬停300ms后开始预览
}

/**
 * 停止视频预览
 */
function stopVideoPreview() {
    clearTimeout(TimelineState.previewTimer);
    
    // 如果正在预览，停止预览
    if (TimelineState.currentVideo && !TimelineState.isPlaying) {
        TimelineState.currentVideo.pause();
        TimelineState.currentVideo.currentTime = 0;
        
        // 恢复占位符显示
        showVideoPlaceholder();
    }
}

/**
 * 预览视频
 */
function previewVideo(event) {
    updateVideoDisplay(event, true);
    
    // 创建或获取视频元素
    let videoElement = document.getElementById(`video-${event.videoId}`);
    
    if (!videoElement) {
        videoElement = createVideoElement(event);
    }
    
    // 显示视频元素
    showVideoElement(videoElement, false);
    
    // 设置预览播放（10秒）
    videoElement.currentTime = 0;
    videoElement.play().then(() => {
        // 10秒后自动暂停
        setTimeout(() => {
            if (videoElement && !TimelineState.isPlaying) {
                videoElement.pause();
                videoElement.currentTime = 0;
                showVideoPlaceholder();
            }
        }, PREVIEW_DURATION * 1000);
    }).catch(error => {
        console.error('视频预览播放失败:', error);
    });
}

/**
 * 播放完整视频
 */
function playFullVideo(event) {
    // 标记为已访问
    TimelineState.markAsVisited(event.id);
    
    // 更新当前事件ID
    TimelineState.currentEventId = event.id;
    
    // 更新UI状态
    updateVisitedUI(event.id);
    
    // 创建或获取视频元素
    let videoElement = document.getElementById(`video-${event.videoId}`);
    
    if (!videoElement) {
        videoElement = createVideoElement(event);
    }
    
    // 显示视频元素
    showVideoElement(videoElement, true);
    
    // 从开头播放
    videoElement.currentTime = 0;
    videoElement.play().then(() => {
        TimelineState.isPlaying = true;
        updatePlayButton(true);
        
        // 更新当前视频引用
        TimelineState.currentVideo = videoElement;
        
        // 更新控制按钮状态
        document.getElementById('playPauseBtn').disabled = false;
        document.getElementById('muteBtn').disabled = false;
    }).catch(error => {
        console.error('视频播放失败:', error);
        updatePlayButton(false);
    });
}

/**
 * 更新已访问UI状态
 */
function updateVisitedUI(eventId) {
    const item = document.querySelector(`.accordion-item[data-id="${eventId}"]`);
    if (item) {
        item.classList.add('visited');
    }
}

/**
 * 创建视频元素
 */
function createVideoElement(event) {
    const videoElement = document.createElement('video');
    videoElement.id = `video-${event.videoId}`;
    videoElement.className = 'video-element';
    videoElement.poster = event.videoPoster;
    videoElement.preload = 'metadata';
    videoElement.controls = false;
    
    // 添加结束事件监听
    videoElement.addEventListener('ended', handleVideoEnd);
    
    // 添加视频源
    const source = document.createElement('source');
    source.type = 'video/mp4';
    // 实际项目中应使用真实视频文件路径
    source.src = `../assets/videos/history/${event.videoId}.mp4`;
    videoElement.appendChild(source);
    
    // 添加备用视频源（如果有）
    const fallbackSource = document.createElement('source');
    fallbackSource.type = 'video/webm';
    fallbackSource.src = `../assets/videos/history/${event.videoId}.webm`;
    videoElement.appendChild(fallbackSource);
    
    document.querySelector('.video-player-container').appendChild(videoElement);
    
    return videoElement;
}

/**
 * 显示视频元素
 */
function showVideoElement(videoElement, isFullPlay = false) {
    // 隐藏其他视频元素
    document.querySelectorAll('.video-element').forEach(video => {
        video.classList.remove('active');
    });
    
    // 显示当前视频元素
    videoElement.classList.add('active');
    
    // 隐藏占位符和引导提示
    document.getElementById('videoPlaceholder').style.display = 'none';
    const guideHint = document.querySelector('.guide-hint');
    if (guideHint) {
        guideHint.style.display = 'none';
    }
    
    // 如果是完整播放，添加播放中状态
    if (isFullPlay) {
        videoElement.dataset.playing = 'true';
    }
}

/**
 * 显示视频占位符
 */
function showVideoPlaceholder() {
    const placeholder = document.getElementById('videoPlaceholder');
    if (placeholder) {
        placeholder.style.display = 'flex';
    }
    
    // 隐藏所有视频元素
    document.querySelectorAll('.video-element').forEach(video => {
        video.classList.remove('active');
    });
}

/**
 * 切换手风琴项目
 */
function toggleAccordion(eventId) {
    const accordionItem = document.querySelector(`.accordion-item[data-id="${eventId}"]`);
    const content = accordionItem.querySelector('.accordion-content');
    const indicator = accordionItem.querySelector('.accordion-indicator');
    
    // 如果点击的是已激活的项目，则关闭它
    if (accordionItem.classList.contains('active')) {
        accordionItem.classList.remove('active');
        content.style.maxHeight = null;
        indicator.style.transform = 'rotate(0deg)';
        
        // 停止视频播放
        if (TimelineState.currentVideo) {
            TimelineState.currentVideo.pause();
            TimelineState.isPlaying = false;
            updatePlayButton(false);
        }
    } else {
        // 关闭所有其他项目
        document.querySelectorAll('.accordion-item.active').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.accordion-content').style.maxHeight = null;
            item.querySelector('.accordion-indicator').style.transform = 'rotate(0deg)';
        });
        
        // 激活当前项目
        accordionItem.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        indicator.style.transform = 'rotate(180deg)';
    }
}

/**
 * 更新视频显示信息
 */
function updateVideoDisplay(event, showVideo = false) {
    // 更新视频标题
    const titleElement = document.getElementById('currentVideoTitle');
    const yearElement = document.getElementById('currentVideoYear');
    
    if (titleElement) titleElement.textContent = event.videoTitle;
    if (yearElement) yearElement.textContent = `${event.year} ${event.era} - ${event.title}`;
    
    // 更新占位符背景
    const placeholder = document.getElementById('videoPlaceholder');
    if (placeholder && event.videoPoster) {
        placeholder.style.background = `linear-gradient(rgba(28, 41, 38, 0.8), rgba(28, 41, 38, 0.9)), url('${event.videoPoster}') center/cover`;
    }
}

/**
 * 处理视频结束事件
 */
function handleVideoEnd() {
    TimelineState.isPlaying = false;
    updatePlayButton(false);
    
    // 显示视频总结
    showVideoSummary();
}

/**
 * 显示视频总结
 */
function showVideoSummary() {
    const currentEvent = timelineData.find(e => e.id === TimelineState.currentEventId);
    if (!currentEvent) return;
    
    // 生成相关事件链接
    let relatedEventsHTML = '';
    if (currentEvent.relatedEvents && currentEvent.relatedEvents.length > 0) {
        relatedEventsHTML = currentEvent.relatedEvents.map(eventId => {
            const event = timelineData.find(e => e.id === eventId);
            if (!event) return '';
            
            return `
                <a href="#" class="related-event-link" data-id="${event.id}">
                    <div class="related-event-year">${event.year} ${event.era}</div>
                    <div class="related-event-title">${event.title}</div>
                    <div class="related-event-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </a>
            `;
        }).join('');
    }
    
    // 创建总结模态框
    const modal = document.createElement('div');
    modal.className = 'video-summary-modal';
    modal.innerHTML = `
        <div class="summary-content">
            <div class="summary-header">
                <h3>${currentEvent.title}</h3>
            </div>
            <div class="summary-body">
                <div class="summary-text">${currentEvent.summaryText}</div>
                
                ${relatedEventsHTML ? `
                <div class="related-events">
                    <div class="related-events-title">继续探索</div>
                    <div class="related-events-list">
                        ${relatedEventsHTML}
                    </div>
                </div>
                ` : ''}
            </div>
            <div class="summary-footer">
                <button class="close-summary-btn">关闭</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 显示模态框
    setTimeout(() => {
        modal.classList.add('active');
    }, 100);
    
    // 添加事件监听
    setupSummaryModalEvents(modal);
}

/**
 * 设置总结模态框事件
 */
function setupSummaryModalEvents(modal) {
    const closeBtn = modal.querySelector('.close-summary-btn');
    const relatedLinks = modal.querySelectorAll('.related-event-link');
    
    // 关闭按钮
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // 相关事件链接
    relatedLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const eventId = parseInt(e.currentTarget.dataset.id);
            const event = timelineData.find(e => e.id === eventId);
            if (event) {
                // 切换到手风琴项目
                toggleAccordion(eventId);
                playFullVideo(event);
                // 关闭总结模态框
                modal.remove();
            }
        });
    });
    
    // 点击外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function onEsc(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', onEsc);
        }
    });
}

/**
 * 初始化视频控制按钮
 */
function initVideoControls() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (!playPauseBtn || !muteBtn || !fullscreenBtn) return;
    
    // 播放/暂停按钮
    playPauseBtn.addEventListener('click', function() {
        if (!TimelineState.currentVideo) return;
        
        if (TimelineState.currentVideo.paused) {
            TimelineState.currentVideo.play();
            TimelineState.isPlaying = true;
            updatePlayButton(true);
        } else {
            TimelineState.currentVideo.pause();
            TimelineState.isPlaying = false;
            updatePlayButton(false);
        }
    });
    
    // 静音按钮
    muteBtn.addEventListener('click', function() {
        if (!TimelineState.currentVideo) return;
        
        TimelineState.currentVideo.muted = !TimelineState.currentVideo.muted;
        const icon = this.querySelector('i');
        if (TimelineState.currentVideo.muted) {
            icon.className = 'fas fa-volume-mute';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    });
    
    // 全屏按钮
    fullscreenBtn.addEventListener('click', function() {
        const videoContainer = document.querySelector('.video-player-container');
        
        if (!videoContainer) return;
        
        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
            
            this.querySelector('i').className = 'fas fa-compress';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            this.querySelector('i').className = 'fas fa-expand';
        }
    });
    
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', function() {
        const icon = fullscreenBtn.querySelector('i');
        if (document.fullscreenElement) {
            icon.className = 'fas fa-compress';
        } else {
            icon.className = 'fas fa-expand';
        }
    });
}

/**
 * 更新播放按钮状态
 */
function updatePlayButton(playing) {
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (!playPauseBtn) return;
    
    const icon = playPauseBtn.querySelector('i');
    
    if (playing) {
        icon.className = 'fas fa-pause';
        playPauseBtn.title = '暂停';
    } else {
        icon.className = 'fas fa-play';
        playPauseBtn.title = '播放';
    }
}

/**
 * 初始化滚动进度指示器
 */
function initScrollProgress() {
    const progressBar = document.getElementById('progressBar');
    const accordionContainer = document.getElementById('accordionContainer');
    
    if (!progressBar || !accordionContainer) return;
    
    accordionContainer.addEventListener('scroll', function() {
        const scrollTop = accordionContainer.scrollTop;
        const scrollHeight = accordionContainer.scrollHeight - accordionContainer.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        progressBar.style.width = scrollPercentage + '%';
    });
}

/**
 * 初始化引导提示
 */
function initGuideHint() {
    const placeholder = document.getElementById('videoPlaceholder');
    if (!placeholder) return;
    
    // 创建引导提示
    const guideHint = document.createElement('div');
    guideHint.className = 'guide-hint';
    guideHint.innerHTML = `
        <div class="hint-arrow">
            <i class="fas fa-long-arrow-alt-left"></i>
        </div>
        <div class="hint-text">点击左侧事件查看对应影像</div>
    `;
    
    placeholder.appendChild(guideHint);
}

/**
 * 添加动画效果
 */
function addAnimations() {
    // 整体模块入场动画
    gsap.from('.history-module', {
        duration: 1,
        opacity: 0,
        y: 30,
        ease: "power2.out"
    });
    
    // 手风琴项目入场动画
    gsap.utils.toArray('.accordion-item').forEach((item, i) => {
        gsap.from(item, {
            duration: 0.8,
            opacity: 0,
            y: 30,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none none"
            }
        });
    });
    
    // 视频区域入场动画
    gsap.from('.video-display', {
        duration: 0.8,
        opacity: 0,
        x: 30,
        delay: 0.3,
        ease: "power2.out"
    });
}

/**
 * 重置历史模块
 */
function resetHistoryModule() {
    // 清除所有访问记录
    TimelineState.clearVisitedEvents();
    
    // 重新初始化
    initTimeline();
}

/**
 * 导出公共方法
 */
const TimelineModule = {
    init: initTimeline,
    reset: resetHistoryModule,
    getCurrentEvent: () => timelineData.find(e => e.id === TimelineState.currentEventId),
    getVisitedCount: () => TimelineState.visitedEvents.size,
    getAllEvents: () => [...timelineData]
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    TimelineModule.init();
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimelineModule;
}