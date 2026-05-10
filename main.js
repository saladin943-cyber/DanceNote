// Local-first storage keeps the MVP simple while preserving an easy backend migration path.
const STORAGE_KEY = "dance-note-records-v1";
const PROFILE_STORAGE_KEY = "dance-note-profile-v1";
const TEAMS_STORAGE_KEY = "dance-note-teams-v1";
const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const GENRE_LABELS = {
  breaking: "브레이킹",
  hiphop: "힙합",
  choreo: "코레오",
  locking: "락킹",
  popping: "팝핀",
  waacking: "왁킹",
  house: "하우스",
  krump: "크럼프",
  voguing: "보깅",
  kpop: "Kpop",
  other: "기타",
};
const PRACTICE_TYPE_LABELS = {
  solo: "개인",
  team: "팀",
};
// 부위별 아바타 커스터마이징은 각 파츠 이미지가 동일한 512x768 캔버스와 동일한 기준점을 공유해야 정상 동작한다.
// 배경은 통이미지를 사용할 수 있지만, 캐릭터는 base/hair/hat/top/bottom/shoes 투명 PNG 레이어로 분리되어야 한다.
const AVATAR_PART_CATALOG = {
  base: {
    rhyme: {
      label: "RHYME",
      image: "/DANCENOTE/avatar/base/rhyme-base.png",
    },
    beatz: {
      label: "BEATZ",
      image: "/DANCENOTE/avatar/base/beatz-base.png",
    },
  },
  hair: {
    short_black: {
      label: "검정 숏헤어",
      image: "/DANCENOTE/avatar/hair/short-black.png",
    },
    ponytail_brown: {
      label: "브라운 포니테일",
      image: "/DANCENOTE/avatar/hair/ponytail-brown.png",
    },
  },
  hat: {
    none: {
      label: "없음",
      image: null,
    },
    black_cap: {
      label: "블랙 캡",
      image: "/DANCENOTE/avatar/hat/black-cap.png",
    },
    mint_cap: {
      label: "민트 캡",
      image: "/DANCENOTE/avatar/hat/mint-cap.png",
    },
    beanie: {
      label: "비니",
      image: "/DANCENOTE/avatar/hat/beanie.png",
    },
  },
  top: {
    hoodie_coral: {
      label: "코랄 후디",
      image: "/DANCENOTE/avatar/top/hoodie-coral.png",
    },
    jacket_mint: {
      label: "민트 자켓",
      image: "/DANCENOTE/avatar/top/jacket-mint.png",
    },
    tshirt_white: {
      label: "화이트 티셔츠",
      image: "/DANCENOTE/avatar/top/tshirt-white.png",
    },
  },
  bottom: {
    pants_black: {
      label: "블랙 팬츠",
      image: "/DANCENOTE/avatar/bottom/pants-black.png",
    },
    shorts_navy: {
      label: "네이비 쇼츠",
      image: "/DANCENOTE/avatar/bottom/shorts-navy.png",
    },
    wide_gray: {
      label: "그레이 와이드팬츠",
      image: "/DANCENOTE/avatar/bottom/wide-gray.png",
    },
  },
  shoes: {
    sneakers_red: {
      label: "레드 스니커즈",
      image: "/DANCENOTE/avatar/shoes/sneakers-red.png",
    },
    sneakers_mint: {
      label: "민트 스니커즈",
      image: "/DANCENOTE/avatar/shoes/sneakers-mint.png",
    },
    hightop_black: {
      label: "블랙 하이탑",
      image: "/DANCENOTE/avatar/shoes/hightop-black.png",
    },
  },
};
const BACKGROUND_CATALOG = {
  back1: {
    label: "Back 1",
    image: "/DANCENOTE/backgrounds/back1.png",
  },
  back2: {
    label: "Back 2",
    image: "/DANCENOTE/backgrounds/back2.png",
  },
  back3: {
    label: "Back 3",
    image: "/DANCENOTE/backgrounds/back3.png",
  },
};
const avatarBuilderState = {
  setup: null,
  update: null,
};

const mockRecords = [
  {
    id: "rec-1",
    practiceDate: "2026-04-03",
    practiceType: "solo",
    genre: "breaking",
    durationMinutes: 90,
    goal: "탑락과 풋워크 연결을 끊기지 않게 이어가기",
    profileId: null,
    teamId: null,
    goalBlocks: [
      {
        id: "goal-mock-1",
        moveName: "탑락과 풋워크 연결",
        targetCount: 10,
        completedCount: 10,
      },
    ],
    practiceNotes: "워밍업 후 풋워크 반복, 마지막 20분은 음악 맞춰 루틴 정리.",
    reflection: "초반에는 몸이 무거웠지만 후반 집중은 좋았다.",
    nextTask: "내일은 프리즈 진입 타이밍 보완.",
    conditionScore: 3,
    satisfactionScore: 4,
    location: "개인 연습실",
    goalCompleted: true,
    createdAt: "2026-04-03T12:10:00.000Z",
    updatedAt: "2026-04-03T12:10:00.000Z",
  },
  {
    id: "rec-2",
    practiceDate: "2026-04-08",
    practiceType: "team",
    genre: "choreo",
    durationMinutes: 140,
    goal: "후렴 동선 정리와 합 맞추기",
    profileId: null,
    teamId: null,
    goalBlocks: [
      {
        id: "goal-mock-2",
        moveName: "후렴 런스루",
        targetCount: 5,
        completedCount: 5,
      },
      {
        id: "goal-mock-3",
        moveName: "동선 정리",
        targetCount: 8,
        completedCount: 8,
      },
    ],
    practiceNotes: "팀원들과 카운트 단위로 동선 수정. 후렴 디테일 반복.",
    reflection: "팀 합은 좋아졌지만 표정과 마무리 디테일이 더 필요하다.",
    nextTask: "동선 전환 구간 영상 촬영 후 확인.",
    conditionScore: 4,
    satisfactionScore: 4,
    location: "팀 스튜디오",
    goalCompleted: true,
    createdAt: "2026-04-08T20:00:00.000Z",
    updatedAt: "2026-04-08T20:00:00.000Z",
  },
  {
    id: "rec-3",
    practiceDate: "2026-04-11",
    practiceType: "solo",
    genre: "popping",
    durationMinutes: 60,
    goal: "히트와 웨이브 감각 다시 잡기",
    profileId: null,
    teamId: null,
    goalBlocks: [
      {
        id: "goal-mock-4",
        moveName: "히트",
        targetCount: 30,
        completedCount: 18,
      },
      {
        id: "goal-mock-5",
        moveName: "웨이브",
        targetCount: 20,
        completedCount: 12,
      },
    ],
    practiceNotes: "거울 보면서 상체 고립 중심 연습.",
    reflection: "컨디션이 낮아서 강도는 낮췄지만 감각 회복에는 도움이 됐다.",
    nextTask: "템포 올려서 리듬 분리 연습.",
    conditionScore: 2,
    satisfactionScore: 3,
    location: "거울방",
    goalCompleted: false,
    createdAt: "2026-04-11T09:30:00.000Z",
    updatedAt: "2026-04-11T09:30:00.000Z",
  },
  {
    id: "rec-4",
    practiceDate: "2026-04-16",
    practiceType: "team",
    genre: "hiphop",
    durationMinutes: 180,
    goal: "공연 전반 흐름 점검과 체력 배분 확인",
    profileId: null,
    teamId: null,
    goalBlocks: [
      {
        id: "goal-mock-6",
        moveName: "전체 런스루",
        targetCount: 2,
        completedCount: 2,
      },
      {
        id: "goal-mock-7",
        moveName: "전환 동작",
        targetCount: 12,
        completedCount: 12,
      },
    ],
    practiceNotes: "전체 런스루 2회, 문제 구간 따로 반복.",
    reflection: "체력 소모가 커서 후반 에너지 유지가 숙제다.",
    nextTask: "호흡 분배와 전환 동작 정리.",
    conditionScore: 3,
    satisfactionScore: 5,
    location: "공연 연습실",
    goalCompleted: true,
    createdAt: "2026-04-16T19:00:00.000Z",
    updatedAt: "2026-04-16T19:00:00.000Z",
  },
  {
    id: "rec-5",
    practiceDate: "2026-04-19",
    practiceType: "solo",
    genre: "locking",
    durationMinutes: 80,
    goal: "그루브 유지하면서 포인트 동작 정리",
    profileId: null,
    teamId: null,
    goalBlocks: [
      {
        id: "goal-mock-8",
        moveName: "그루브",
        targetCount: 15,
        completedCount: 9,
      },
      {
        id: "goal-mock-9",
        moveName: "포인트 동작",
        targetCount: 20,
        completedCount: 14,
      },
    ],
    practiceNotes: "베이직 반복 후 짧은 프리스타일 기록.",
    reflection: "기본기 연습이 짧게라도 쌓이는 느낌이 좋았다.",
    nextTask: "팔 라인 정돈과 음악 해석 확장.",
    conditionScore: 4,
    satisfactionScore: 4,
    location: "개인 연습실",
    goalCompleted: false,
    createdAt: "2026-04-19T13:20:00.000Z",
    updatedAt: "2026-04-19T13:20:00.000Z",
  },
];

const state = {
  records: loadRecords(),
  profile: loadProfile(),
  teams: loadTeams(),
  currentMonth: getMonthStart(new Date()),
  selectedDate: formatDateKey(new Date()),
  editingRecordId: null,
  reviewingRecordId: null,
  activeTab: "home",
  calendarModalMode: null,
  modalDate: null,
  modalRecordId: null,
  modalDraftGoalBlocks: [],
  showAllMoveStats: false,
};

const elements = {
  tabButtons: document.querySelectorAll("[data-tab]"),
  tabPanels: document.querySelectorAll("[data-tab-panel]"),
  homeContent: document.getElementById("homeContent"),
  heroSummary: document.getElementById("heroSummary"),
  monthLabel: document.getElementById("monthLabel"),
  weekdayRow: document.getElementById("weekdayRow"),
  calendarGrid: document.getElementById("calendarGrid"),
  selectedDateLabel: document.getElementById("selectedDateLabel"),
  dailySummary: document.getElementById("dailySummary"),
  recordList: document.getElementById("recordList"),
  statsGrid: document.getElementById("statsGrid"),
  calendarModal: document.getElementById("calendarModal"),
  calendarModalTitle: document.getElementById("calendarModalTitle"),
  calendarModalKicker: document.getElementById("calendarModalKicker"),
  calendarModalBody: document.getElementById("calendarModalBody"),
  celebrationOverlay: document.getElementById("celebrationOverlay"),
  prevMonthButton: document.getElementById("prevMonthButton"),
  nextMonthButton: document.getElementById("nextMonthButton"),
  todayButton: document.getElementById("todayButton"),
  newRecordButton: document.getElementById("newRecordButton"),
  resetFormButton: document.getElementById("resetFormButton"),
};

init();

function init() {
  renderWeekdays();
  bindEvents();
  render();
}

function bindEvents() {
  elements.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveTab(button.dataset.tab);
    });
  });

  elements.prevMonthButton.addEventListener("click", () => {
    state.currentMonth = addMonths(state.currentMonth, -1);
    render();
  });

  elements.nextMonthButton.addEventListener("click", () => {
    state.currentMonth = addMonths(state.currentMonth, 1);
    render();
  });

  elements.todayButton.addEventListener("click", () => {
    const today = new Date();
    state.currentMonth = getMonthStart(today);
    state.selectedDate = formatDateKey(today);
    state.editingRecordId = null;
    render();
  });

  elements.newRecordButton.addEventListener("click", () => {
    openCalendarModalForDate(state.selectedDate);
  });

  elements.statsGrid.addEventListener("click", (event) => {
    if (event.target.matches("[data-action='toggle-move-stats']")) {
      toggleMoveStatsView();
    }
  });

  elements.calendarModal.addEventListener("click", handleCalendarModalClick);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.calendarModal.hidden) {
      closeCalendarModal();
    }
  });
}

function render() {
  const monthRecords = getMonthRecords(state.records, state.currentMonth);
  const selectedRecords = getRecordsByDate(state.records, state.selectedDate);

  renderTabs();
  renderHome();
  elements.monthLabel.textContent = formatMonthLabel(state.currentMonth);
  elements.selectedDateLabel.textContent = formatSelectedDate(state.selectedDate);

  renderHero(monthRecords);
  renderCalendar();
  renderDailySummary(selectedRecords);
  renderRecordList(selectedRecords);
  renderStats(monthRecords);
}

function setActiveTab(tabName) {
  state.activeTab = tabName;
  renderTabs();
}

function renderTabs() {
  elements.tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === state.activeTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  elements.tabPanels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === state.activeTab;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function renderHome() {
  if (!state.profile) {
    renderProfileSetup();
    return;
  }

  state.profile = normalizeProfileAvatar(state.profile);
  const team = getProfileTeam();
  const monthRecords = getMonthRecords(state.records, state.currentMonth);
  const topMove = getTopMove(monthRecords);
  const avatar = state.profile.avatar;
  elements.homeContent.innerHTML = `
    <div class="home-grid">
      <section class="panel room-card">
        <div class="section-head">
          <div>
            <p class="section-kicker">My Room</p>
            <h2>내 미니 연습실</h2>
          </div>
          <span class="profile-chip">${team ? escapeHtml(team.teamName) : "Solo"}</span>
        </div>
        ${renderPersonalRoom()}
      </section>

      <div class="home-side-stack">
        <section class="panel mini-room-card">
          <div class="section-head">
            <div>
              <p class="section-kicker">Dancer Profile</p>
              <h2>${escapeHtml(state.profile.dancerName)}</h2>
            </div>
          </div>
          <div class="profile-detail-grid">
            <span>주 장르</span>
            <strong>${GENRE_LABELS[state.profile.mainGenre] || state.profile.mainGenre}</strong>
            <span>팀</span>
            <strong>${team ? escapeHtml(team.teamName) : "없음"}</strong>
            <span>캐릭터</span>
            <strong>${getAvatarPartLabel("base", avatar.baseId)}</strong>
            <span>상의</span>
            <strong>${getAvatarPartLabel("top", avatar.topId)}</strong>
            <span>배경</span>
            <strong>${BACKGROUND_CATALOG[avatar.backgroundId]?.label || avatar.backgroundId}</strong>
            <span>최근 업데이트</span>
            <strong>${formatRelativeDateTime(state.profile.updatedAt)}</strong>
          </div>
          <div class="profile-month-insight">
            <strong>이번 달 집중 동작: ${topMove ? escapeHtml(topMove.moveName) : "아직 없음"}</strong>
            <span>이번 달 수행 횟수: ${topMove ? topMove.completedCount : 0}회</span>
            <span>이번 달 연습 기록: ${monthRecords.length}개</span>
          </div>
        </section>

        <section class="panel mini-room-card">
          <div class="section-head">
            <div>
              <p class="section-kicker">Avatar</p>
              <h2>아바타 수정</h2>
            </div>
          </div>
          ${renderAvatarUpdateForm()}
        </section>

        <section class="panel mini-room-card">
          ${team ? renderTeamRoom(team) : renderNoTeamState()}
        </section>

        <section class="panel mini-room-card">
          <div class="section-head">
            <div>
              <p class="section-kicker">Test Tools</p>
              <h2>프로필 초기화</h2>
            </div>
          </div>
          <p class="stat-subtext">개발/테스트용 버튼입니다. 연습 기록은 삭제하지 않습니다.</p>
          <button class="danger-button" id="resetProfileButton" type="button">프로필 초기화</button>
        </section>
      </div>
    </div>
  `;
  bindHomeEvents();
}

function renderProfileSetup() {
  avatarBuilderState.setup = getDefaultLayeredAvatar();
  elements.homeContent.innerHTML = `
    <section class="panel profile-setup">
      <div class="setup-copy">
        <p class="section-kicker">Home</p>
        <h2>나의 댄서 캐릭터 만들기</h2>
        <p>댄서 네임, 장르, 스타일을 정하고 나만의 연습실을 시작하세요.</p>
      </div>

      <form class="setup-form" id="profileSetupForm">
        <div class="field-row">
          <label class="field">
            <span>댄서 네임</span>
            <input id="setupDancerName" name="dancerName" type="text" required placeholder="예: Yugi, Rookie, Flow" />
          </label>

          <label class="field">
            <span>주 장르</span>
            <select id="setupMainGenre" name="mainGenre">
              ${renderGenreOptions()}
            </select>
          </label>
        </div>

        <label class="field">
          <span>팀 소속 여부</span>
          <select id="setupTeamMode" name="teamMode">
            <option value="none">없음</option>
            <option value="create">새 팀 만들기</option>
          </select>
        </label>

        <div class="team-create-fields" id="setupTeamFields" hidden>
          <!-- Future scope: existing team selection can be added here when accounts and shared teams exist. -->
          <div class="field-row">
            <label class="field">
              <span>팀 이름</span>
              <input id="setupTeamName" name="teamName" type="text" />
            </label>

            <label class="field">
              <span>팀 장르</span>
              <select id="setupTeamGenre" name="teamGenre">
                ${renderGenreOptions()}
              </select>
            </label>
          </div>

          <label class="field">
            <span>리더</span>
            <input id="setupLeaderName" name="leaderName" type="text" />
          </label>
        </div>

        ${renderAvatarBuilder("setup", avatarBuilderState.setup)}

        <button class="accent-button" type="submit">캐릭터 생성하기</button>
      </form>
    </section>
  `;
  renderCharacterBuilderPreview("setup");
  syncAvatarBuilderLabels("setup");
  bindHomeEvents();
}

function renderPersonalRoom() {
  const profile = normalizeProfileAvatar(state.profile);
  return `
    <div class="room-image-stage personal-room">
      <img
        class="preview-background"
        src="${profile.avatarPreview.backgroundImage}"
        alt=""
        onerror="this.closest('.room-image-stage').classList.add('uses-background-fallback')"
      />
      <div class="room-stage-shade"></div>
      <div class="room-avatar-layer-wrap">
        ${renderLayeredAvatar(profile, { label: profile.dancerName })}
      </div>
    </div>
  `;
}

function renderTeamRoom(team) {
  const backgroundImage = getBackgroundImagePath(state.profile.avatar.backgroundId);
  const mockMembers = [
    {
      id: "mock-1",
      dancerName: "Beat",
      mainGenre: team.genre,
      avatar: {
        baseId: "beatz",
        hairId: "short_black",
        hatId: "mint_cap",
        topId: "jacket_mint",
        bottomId: "pants_black",
        shoesId: "sneakers_mint",
        backgroundId: state.profile.avatar.backgroundId,
      },
    },
    {
      id: "mock-2",
      dancerName: "Line",
      mainGenre: team.genre,
      avatar: {
        baseId: "rhyme",
        hairId: "ponytail_brown",
        hatId: "black_cap",
        topId: "hoodie_coral",
        bottomId: "shorts_navy",
        shoesId: "sneakers_red",
        backgroundId: state.profile.avatar.backgroundId,
      },
    },
  ];

  return `
    <div class="section-head">
      <div>
        <p class="section-kicker">Team Room</p>
        <h2>팀 공간</h2>
      </div>
      <span class="profile-chip">${team.memberIds.length + mockMembers.length}명</span>
    </div>
    <div class="team-meta-grid">
      <span>팀 이름</span>
      <strong>${escapeHtml(team.teamName)}</strong>
      <span>팀 장르</span>
      <strong>${GENRE_LABELS[team.genre] || team.genre}</strong>
      <span>리더</span>
      <strong>${escapeHtml(team.leaderName)}</strong>
    </div>
    <div class="avatar-room team-room">
      <img
        class="preview-background"
        src="${backgroundImage}"
        alt=""
        onerror="this.closest('.avatar-room').classList.add('uses-background-fallback')"
      />
      <div class="room-stage-shade"></div>
      <div class="room-floor team-floor image-team-floor">
        ${renderAvatar(state.profile, { label: state.profile.dancerName, size: "small" })}
        ${mockMembers.map((member) => renderAvatar(member, { label: member.dancerName, size: "small", isMock: true })).join("")}
      </div>
    </div>
    <div class="team-member-row">
      <span>${escapeHtml(state.profile.dancerName)}</span>
      <span>Mock teammates are preview only</span>
    </div>
  `;
}

function renderAvatar(profile, options = {}) {
  return renderLayeredAvatar(profile, options);
}

function renderLayeredAvatar(profile, options = {}) {
  const normalizedProfile = normalizeProfileAvatar(profile);
  const sizeClass = options.size === "small" ? "is-small" : "";
  const mockClass = options.isMock ? "is-mock" : "";
  const labelClass = options.hideLabel ? " has-hidden-label" : "";
  const label = options.label || normalizedProfile.dancerName;
  const avatar = normalizedProfile.avatar;
  const layers = [
    renderAvatarLayer("base", getAvatarPartAsset("base", avatar.baseId), true),
    renderAvatarLayer("hair", getAvatarPartAsset("hair", avatar.hairId)),
    renderAvatarLayer("bottom", getAvatarPartAsset("bottom", avatar.bottomId)),
    renderAvatarLayer("top", getAvatarPartAsset("top", avatar.topId)),
    renderAvatarLayer("shoes", getAvatarPartAsset("shoes", avatar.shoesId)),
    renderAvatarLayer("hat", getAvatarPartAsset("hat", avatar.hatId)),
  ].join("");

  return `
    <div class="layered-avatar ${sizeClass} ${mockClass}${labelClass}">
      ${layers}
      ${renderCssAvatarFallback(normalizedProfile.avatar)}
      ${options.hideLabel ? "" : `<div class="avatar-label">${escapeHtml(label)}</div>`}
    </div>
  `;
}

function renderAvatarUpdateForm() {
  avatarBuilderState.update = normalizeProfileAvatar(state.profile).avatar;
  return `
    <form class="setup-form" id="avatarUpdateForm">
      <div class="field-row">
        <label class="field">
          <span>댄서 네임</span>
          <input id="updateDancerName" name="dancerName" type="text" required value="${escapeHtml(state.profile.dancerName)}" />
        </label>
        <label class="field">
          <span>주 장르</span>
          <select id="updateMainGenre" name="mainGenre">
            ${renderGenreOptions(state.profile.mainGenre)}
          </select>
        </label>
      </div>
      ${renderAvatarBuilder("update", avatarBuilderState.update)}
      <button class="accent-button" type="submit">아바타 저장</button>
    </form>
  `;
}

function renderNoTeamState() {
  return `
    <div class="section-head">
      <div>
        <p class="section-kicker">Team Room</p>
        <h2>팀이 아직 없습니다</h2>
      </div>
    </div>
    <p class="stat-subtext">대표 팀은 현재 MVP에서 0개 또는 1개만 사용할 수 있습니다.</p>
    <button class="ghost-button" id="createTeamButton" type="button">팀 만들기</button>
    <div id="inlineTeamForm" class="inline-team-form" hidden>
      ${renderTeamCreateForm()}
    </div>
  `;
}

function renderTeamCreateForm() {
  return `
    <form class="setup-form" id="teamCreateForm">
      <div class="field-row">
        <label class="field">
          <span>팀 이름</span>
          <input id="teamCreateName" name="teamName" type="text" required />
        </label>
        <label class="field">
          <span>팀 장르</span>
          <select id="teamCreateGenre" name="teamGenre">
            ${renderGenreOptions(state.profile?.mainGenre || "breaking")}
          </select>
        </label>
      </div>
      <label class="field">
        <span>리더</span>
        <input id="teamCreateLeader" name="leaderName" type="text" required value="${escapeHtml(state.profile?.dancerName || "")}" />
      </label>
      <button class="accent-button" type="submit">팀 생성하기</button>
    </form>
  `;
}

function renderAvatarBuilder(scope, avatar) {
  const normalizedAvatar = normalizeAvatarState(avatar);
  return `
    <section class="avatar-builder" data-builder-scope="${scope}">
      <div class="avatar-builder-layout">
        ${renderAvatarPreviewStage(scope, normalizedAvatar)}
        <div class="selector-list">
          ${renderArrowSelector({ scope, key: "baseId", label: "캐릭터", valueLabel: getAvatarPartLabel("base", normalizedAvatar.baseId) })}
          ${renderArrowSelector({ scope, key: "hairId", label: "헤어", valueLabel: getAvatarPartLabel("hair", normalizedAvatar.hairId) })}
          ${renderArrowSelector({ scope, key: "hatId", label: "모자", valueLabel: getAvatarPartLabel("hat", normalizedAvatar.hatId) })}
          ${renderArrowSelector({ scope, key: "topId", label: "상의", valueLabel: getAvatarPartLabel("top", normalizedAvatar.topId) })}
          ${renderArrowSelector({ scope, key: "bottomId", label: "하의", valueLabel: getAvatarPartLabel("bottom", normalizedAvatar.bottomId) })}
          ${renderArrowSelector({ scope, key: "shoesId", label: "신발", valueLabel: getAvatarPartLabel("shoes", normalizedAvatar.shoesId) })}
          ${renderArrowSelector({ scope, key: "backgroundId", label: "배경", valueLabel: BACKGROUND_CATALOG[normalizedAvatar.backgroundId]?.label || normalizedAvatar.backgroundId })}
        </div>
      </div>
    </section>
  `;
}

function renderAvatarPreviewStage(scope, avatar) {
  const backgroundImage = getBackgroundImagePath(avatar.backgroundId);
  return `
    <div class="avatar-preview-wrap">
      <div class="avatar-preview-stage" id="${scope}AvatarPreviewStage">
        <img
          class="preview-background"
          data-preview-background="${scope}"
          src="${backgroundImage}"
          alt=""
          onerror="this.closest('.avatar-preview-stage').classList.add('uses-background-fallback')"
        />
        <div class="room-stage-shade"></div>
        <div class="preview-avatar-layer-wrap" data-preview-avatar="${scope}">
          ${renderLayeredAvatar({ avatar, dancerName: "Preview" }, { hideLabel: true })}
        </div>
      </div>
      <div class="preview-caption" id="${scope}PreviewCaption">${getPreviewCaption(avatar)}</div>
    </div>
  `;
}

function renderArrowSelector({ scope, key, label, valueLabel }) {
  return `
    <div class="arrow-selector" data-selector-scope="${scope}" data-key="${key}">
      <span class="arrow-selector-label">${label}</span>
      <button class="arrow-selector-button" type="button" data-selector-prev data-scope="${scope}" data-key="${key}" aria-label="${label} 이전">‹</button>
      <strong class="arrow-selector-value" data-selector-value="${scope}-${key}">${valueLabel}</strong>
      <button class="arrow-selector-button" type="button" data-selector-next data-scope="${scope}" data-key="${key}" aria-label="${label} 다음">›</button>
    </div>
  `;
}

function bindHomeEvents() {
  const setupForm = document.getElementById("profileSetupForm");
  const avatarUpdateForm = document.getElementById("avatarUpdateForm");
  const teamCreateForm = document.getElementById("teamCreateForm");
  const teamModeSelect = document.getElementById("setupTeamMode");
  const dancerNameInput = document.getElementById("setupDancerName");
  const leaderNameInput = document.getElementById("setupLeaderName");
  const createTeamButton = document.getElementById("createTeamButton");
  const resetProfileButton = document.getElementById("resetProfileButton");

  setupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    createProfileFromForm();
  });

  avatarUpdateForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    updateAvatarFromForm();
  });

  teamCreateForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    createTeamFromForm();
  });

  teamModeSelect?.addEventListener("change", () => {
    const teamFields = document.getElementById("setupTeamFields");
    const shouldCreateTeam = teamModeSelect.value === "create";
    teamFields.hidden = !shouldCreateTeam;
    document.getElementById("setupTeamName").required = shouldCreateTeam;
    document.getElementById("setupLeaderName").required = shouldCreateTeam;
    if (shouldCreateTeam && !leaderNameInput.value.trim()) {
      leaderNameInput.value = dancerNameInput.value.trim();
    }
  });

  dancerNameInput?.addEventListener("input", () => {
    if (teamModeSelect?.value === "create" && leaderNameInput && !leaderNameInput.dataset.touched) {
      leaderNameInput.value = dancerNameInput.value.trim();
    }
  });

  leaderNameInput?.addEventListener("input", () => {
    leaderNameInput.dataset.touched = "true";
  });

  createTeamButton?.addEventListener("click", () => {
    const formWrap = document.getElementById("inlineTeamForm");
    formWrap.hidden = !formWrap.hidden;
  });

  resetProfileButton?.addEventListener("click", resetProfile);

  document.querySelectorAll("[data-selector-prev], [data-selector-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.hasAttribute("data-selector-prev") ? -1 : 1;
      cycleAvatarOption(button.dataset.key, direction, button.dataset.scope);
    });
  });
}

function createProfileFromForm() {
  const now = new Date().toISOString();
  const teamMode = document.getElementById("setupTeamMode").value;
  const dancerName = document.getElementById("setupDancerName").value.trim();
  const avatar = normalizeAvatarState(getCurrentAvatarBuilderState("setup"));
  const profile = normalizeProfileAvatar({
    id: createScopedId("profile"),
    dancerName,
    mainGenre: document.getElementById("setupMainGenre").value,
    teamId: null,
    avatar,
    createdAt: now,
    updatedAt: now,
  });

  if (teamMode === "create") {
    const team = {
      id: createScopedId("team"),
      teamName: document.getElementById("setupTeamName").value.trim(),
      genre: document.getElementById("setupTeamGenre").value,
      leaderName: document.getElementById("setupLeaderName").value.trim() || dancerName,
      memberIds: [profile.id],
      createdAt: now,
      updatedAt: now,
    };
    state.teams = [team];
    profile.teamId = team.id;
    persistTeams();
  }

  state.profile = profile;
  persistProfile();
  renderHome();
}

function updateAvatarFromForm() {
  if (!state.profile) {
    return;
  }

  state.profile = {
    ...state.profile,
    dancerName: document.getElementById("updateDancerName").value.trim(),
    mainGenre: document.getElementById("updateMainGenre").value,
    avatar: normalizeAvatarState(getCurrentAvatarBuilderState("update")),
    updatedAt: new Date().toISOString(),
  };
  state.profile = normalizeProfileAvatar(state.profile);
  persistProfile();
  renderHome();
}

function createTeamFromForm() {
  if (!state.profile) {
    return;
  }

  const now = new Date().toISOString();
  const team = {
    id: createScopedId("team"),
    teamName: document.getElementById("teamCreateName").value.trim(),
    genre: document.getElementById("teamCreateGenre").value,
    leaderName: document.getElementById("teamCreateLeader").value.trim(),
    memberIds: [state.profile.id],
    createdAt: now,
    updatedAt: now,
  };

  // Data hierarchy for the Firebase migration path:
  // Team -> Dancer Profile -> Practice Records.
  state.teams = [team];
  state.profile = {
    ...state.profile,
    teamId: team.id,
    updatedAt: now,
  };
  persistTeams();
  persistProfile();
  renderHome();
}

function getProfileTeam() {
  if (!state.profile?.teamId) {
    return null;
  }
  return state.teams.find((team) => team.id === state.profile.teamId) || null;
}

function resetProfile() {
  if (!window.confirm("프로필을 초기화할까요? 연습 기록은 유지됩니다.")) {
    return;
  }

  const shouldDeleteTeams = window.confirm("연결된 팀 데이터도 삭제할까요?");
  state.profile = null;
  window.localStorage.removeItem(PROFILE_STORAGE_KEY);

  if (shouldDeleteTeams) {
    state.teams = [];
    window.localStorage.removeItem(TEAMS_STORAGE_KEY);
  }

  renderHome();
}

function renderGenreOptions(selectedValue = "breaking") {
  return Object.entries(GENRE_LABELS)
    .map(([value, label]) => `<option value="${value}" ${value === selectedValue ? "selected" : ""}>${label}</option>`)
    .join("");
}

function migrateProfileToImageAvatar(profile) {
  if (!profile) {
    return profile;
  }
  return normalizeProfileAvatar(profile);
}

function normalizeProfileAvatar(profile) {
  const avatar = normalizeLayeredAvatarState(profile.avatar || getDefaultLayeredAvatar());
  return {
    ...profile,
    avatar,
    avatarPreview: {
      backgroundImage: getBackgroundImagePath(avatar.backgroundId),
    },
  };
}

function getDefaultLayeredAvatar() {
  return {
    baseId: "rhyme",
    hairId: "short_black",
    hatId: "none",
    topId: "hoodie_coral",
    bottomId: "pants_black",
    shoesId: "sneakers_red",
    backgroundId: "back1",
  };
}

function normalizeAvatarState(avatar = {}) {
  return normalizeLayeredAvatarState(avatar);
}

function normalizeLayeredAvatarState(avatar = {}) {
  const migratedAvatar = migrateLegacyAvatarToLayered(avatar);
  const defaults = getDefaultLayeredAvatar();
  const baseId = AVATAR_PART_CATALOG.base[migratedAvatar.baseId] ? migratedAvatar.baseId : defaults.baseId;
  const hairId = AVATAR_PART_CATALOG.hair[migratedAvatar.hairId] ? migratedAvatar.hairId : defaults.hairId;
  const hatId = AVATAR_PART_CATALOG.hat[migratedAvatar.hatId] ? migratedAvatar.hatId : defaults.hatId;
  const topId = AVATAR_PART_CATALOG.top[migratedAvatar.topId] ? migratedAvatar.topId : defaults.topId;
  const bottomId = AVATAR_PART_CATALOG.bottom[migratedAvatar.bottomId] ? migratedAvatar.bottomId : defaults.bottomId;
  const shoesId = AVATAR_PART_CATALOG.shoes[migratedAvatar.shoesId] ? migratedAvatar.shoesId : defaults.shoesId;
  const backgroundId = BACKGROUND_CATALOG[avatar.backgroundId] ? avatar.backgroundId : "back1";

  return {
    baseId,
    hairId,
    hatId,
    topId,
    bottomId,
    shoesId,
    backgroundId,
  };
}

function migrateLegacyAvatarToLayered(avatar = {}) {
  if (avatar.baseId || avatar.hairId || avatar.topId || avatar.bottomId || avatar.shoesId) {
    return avatar;
  }

  const isBeatz = avatar.baseCharacterId === "beatz" || avatar.baseCharacterId === "point_pose";
  const isRhyme = avatar.baseCharacterId === "rhyme" || avatar.baseCharacterId === "basic_stand" || avatar.baseCharacterId === "happy_wave";
  return {
    baseId: isBeatz ? "beatz" : "rhyme",
    hairId: isRhyme ? "ponytail_brown" : "short_black",
    hatId: avatar.hat === "cap" ? "black_cap" : "none",
    topId: isBeatz ? "jacket_mint" : "hoodie_coral",
    bottomId: avatar.bottom === "shorts" || isRhyme ? "shorts_navy" : "pants_black",
    shoesId: isBeatz ? "sneakers_mint" : "sneakers_red",
    backgroundId: BACKGROUND_CATALOG[avatar.backgroundId] ? avatar.backgroundId : "back1",
  };
}

function getCurrentAvatarBuilderState(scope) {
  avatarBuilderState[scope] = normalizeLayeredAvatarState(avatarBuilderState[scope] || getDefaultLayeredAvatar());
  return avatarBuilderState[scope];
}

function cycleAvatarOption(key, direction, scope) {
  const current = getCurrentAvatarBuilderState(scope);
  let nextAvatar = { ...current };
  const options = getAvatarOptionValues(key, current);
  const currentValue = current[key];
  const currentIndex = Math.max(options.indexOf(currentValue), 0);
  const nextIndex = (currentIndex + direction + options.length) % options.length;
  const nextValue = options[nextIndex];

  nextAvatar[key] = nextValue;

  avatarBuilderState[scope] = normalizeLayeredAvatarState(nextAvatar);
  renderCharacterBuilderPreview(scope);
  syncAvatarBuilderLabels(scope);
}

function getAvatarOptionValues(key, avatar) {
  const partKeyBySelector = {
    baseId: "base",
    hairId: "hair",
    hatId: "hat",
    topId: "top",
    bottomId: "bottom",
    shoesId: "shoes",
  };
  if (partKeyBySelector[key]) {
    return Object.keys(AVATAR_PART_CATALOG[partKeyBySelector[key]]);
  }
  if (key === "backgroundId") {
    return Object.keys(BACKGROUND_CATALOG);
  }
  return [];
}

function renderCharacterBuilderPreview(scope) {
  const avatar = getCurrentAvatarBuilderState(scope);
  const avatarPreview = document.querySelector(`[data-preview-avatar="${scope}"]`);
  const backgroundImage = document.querySelector(`[data-preview-background="${scope}"]`);
  const caption = document.getElementById(`${scope}PreviewCaption`);

  if (avatarPreview) {
    avatarPreview.innerHTML = renderLayeredAvatar({ avatar, dancerName: "Preview" }, { hideLabel: true });
  }
  if (backgroundImage) {
    backgroundImage.src = getBackgroundImagePath(avatar.backgroundId);
    backgroundImage.closest(".avatar-preview-stage")?.classList.remove("uses-background-fallback");
  }
  if (caption) {
    caption.textContent = getPreviewCaption(avatar);
  }
}

function syncAvatarBuilderLabels(scope) {
  const avatar = getCurrentAvatarBuilderState(scope);
  const labels = {
    baseId: getAvatarPartLabel("base", avatar.baseId),
    hairId: getAvatarPartLabel("hair", avatar.hairId),
    hatId: getAvatarPartLabel("hat", avatar.hatId),
    topId: getAvatarPartLabel("top", avatar.topId),
    bottomId: getAvatarPartLabel("bottom", avatar.bottomId),
    shoesId: getAvatarPartLabel("shoes", avatar.shoesId),
    backgroundId: BACKGROUND_CATALOG[avatar.backgroundId]?.label || avatar.backgroundId,
  };

  Object.entries(labels).forEach(([key, value]) => {
    const node = document.querySelector(`[data-selector-value="${scope}-${key}"]`);
    if (node) {
      node.textContent = value;
    }
  });
}

function getBackgroundImagePath(backgroundId) {
  return BACKGROUND_CATALOG[backgroundId]?.image || BACKGROUND_CATALOG.back1.image;
}

function getAvatarPartAsset(partType, partId) {
  return AVATAR_PART_CATALOG[partType]?.[partId] || null;
}

function getAvatarPartLabel(partType, partId) {
  return getAvatarPartAsset(partType, partId)?.label || partId;
}

function renderAvatarLayer(partType, asset, isBase = false) {
  if (!asset?.image) {
    return "";
  }
  const fallbackHandler = isBase
    ? "this.style.display='none'; this.closest('.layered-avatar').classList.add('uses-css-fallback')"
    : "this.style.display='none'";
  return `<img class="avatar-layer avatar-layer-${partType}" src="${asset.image}" alt="" onerror="${fallbackHandler}" />`;
}

function getPreviewCaption(avatar) {
  const normalizedAvatar = normalizeLayeredAvatarState(avatar);
  return `${getAvatarPartLabel("base", normalizedAvatar.baseId)} · ${getAvatarPartLabel("top", normalizedAvatar.topId)} · ${BACKGROUND_CATALOG[normalizedAvatar.backgroundId]?.label || normalizedAvatar.backgroundId}`;
}

function getCharacterFallbackClass(avatar) {
  const normalizedAvatar = normalizeLayeredAvatarState(avatar);
  return normalizedAvatar.baseId === "beatz" ? "avatar-fallback-beatz" : "avatar-fallback-rhyme";
}

function renderCssAvatarFallback(avatar) {
  return `
    <div class="avatar-fallback-shape ${getCharacterFallbackClass(avatar)}" aria-hidden="true">
      <span class="avatar-fallback-head"></span>
      <span class="avatar-fallback-body"></span>
      <span class="avatar-fallback-legs"></span>
    </div>
  `;
}

function renderHero(monthRecords) {
  const totalMinutes = monthRecords.reduce((sum, record) => sum + record.durationMinutes, 0);
  const reviewedCount = monthRecords.filter((record) => record.reviewStatus === "reviewed").length;
  const activeDays = new Set(monthRecords.map((record) => record.practiceDate)).size;

  elements.heroSummary.innerHTML = `
    <p class="section-kicker">This Month Snapshot</p>
    <div class="hero-metrics">
      <div class="hero-metric">
        <span>연습한 날</span>
        <strong>${activeDays}일</strong>
      </div>
      <div class="hero-metric">
        <span>누적 시간</span>
        <strong>${formatMinutes(totalMinutes)}</strong>
      </div>
      <div class="hero-metric">
        <span>기록 수</span>
        <strong>${monthRecords.length}개</strong>
      </div>
      <div class="hero-metric">
        <span>회고 완료</span>
        <strong>${reviewedCount}회</strong>
      </div>
    </div>
  `;
}

function renderWeekdays() {
  elements.weekdayRow.innerHTML = WEEKDAY_LABELS
    .map((label) => `<div class="weekday-cell">${label}</div>`)
    .join("");
}

function renderCalendar() {
  const days = buildCalendarDays(state.currentMonth);
  elements.calendarGrid.innerHTML = days.map(renderCalendarDay).join("");

  elements.calendarGrid.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedDate = button.dataset.date;
      state.editingRecordId = null;
      render();
      openCalendarModalForDate(button.dataset.date);
    });
  });
}

function renderCalendarDay(day) {
  const dateKey = formatDateKey(day.date);
  const records = getRecordsByDate(state.records, dateKey);
  const totalMinutes = records.reduce((sum, record) => sum + record.durationMinutes, 0);
  const completedMoves = getTotalCompletedCount(records);
  const dayReviewStatus = getDayReviewStatus(records);
  const dayGoalCheckRate = getDayGoalCheckRate(records);
  const reviewLevel = getReviewLevel(dayGoalCheckRate);
  const intensityLevel = getIntensityLevel(totalMinutes);
  const isSelected = dateKey === state.selectedDate;
  const isToday = dateKey === formatDateKey(new Date());
  const dayClasses = [
    "calendar-day",
    day.isCurrentMonth ? "" : "is-outside",
    isSelected ? "is-selected" : "",
    isToday ? "is-today" : "",
    reviewLevel ? `review-level-${reviewLevel}` : "",
    dayReviewStatus === "reviewed" ? "is-goals-complete" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <button class="${dayClasses}" type="button" data-date="${dateKey}">
      ${dayReviewStatus ? `<span class="status-dot is-${dayReviewStatus}"></span>` : ""}
      <span class="calendar-day-number">${day.date.getDate()}</span>
      ${completedMoves ? `<span class="calendar-move-badge">${completedMoves}회</span>` : ""}
      <div class="calendar-day-meta">
        ${records.length ? `<span class="intensity-pill level-${intensityLevel}">${formatMinutes(totalMinutes)}</span>` : "<span></span>"}
        ${records.length ? `<span class="count-pill">${records.length}</span>` : ""}
      </div>
    </button>
  `;
}

function renderDailySummary(records) {
  if (!records.length) {
    elements.dailySummary.innerHTML = `
      <div class="empty-state">
        아직 기록이 없습니다. 선택한 날짜의 연습을 바로 추가해서 캘린더 흐름을 채워보세요.
      </div>
    `;
    return;
  }

  const totalMinutes = records.reduce((sum, record) => sum + record.durationMinutes, 0);
  const reviewedCount = records.filter((record) => record.reviewStatus === "reviewed").length;
  const completedMoves = getTotalCompletedCount(records);
  const avgCondition = average(records.map((record) => record.conditionScore));
  const avgSatisfaction = average(records.map((record) => record.satisfactionScore));

  elements.dailySummary.innerHTML = `
    <div class="summary-grid">
      <div class="summary-card">
        <span>연습 횟수</span>
        <strong>${records.length}회</strong>
      </div>
      <div class="summary-card">
        <span>총 연습 시간</span>
        <strong>${formatMinutes(totalMinutes)}</strong>
      </div>
      <div class="summary-card">
        <span>평균 컨디션</span>
        <strong>${avgCondition.toFixed(1)}</strong>
      </div>
      <div class="summary-card">
        <span>평균 만족도</span>
        <strong>${avgSatisfaction.toFixed(1)}</strong>
      </div>
      <div class="summary-card">
        <span>동작 수행</span>
        <strong>${completedMoves}회</strong>
      </div>
    </div>
    <p class="stat-subtext">회고 완료 기록 ${reviewedCount}회 포함</p>
  `;
}

function renderRecordList(records) {
  if (!records.length) {
    elements.recordList.innerHTML = "";
    return;
  }

  const sortedRecords = [...records].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  elements.recordList.innerHTML = sortedRecords.map(renderRecordCard).join("");

  elements.recordList.querySelectorAll("[data-action='edit']").forEach((button) => {
    button.addEventListener("click", () => {
      const record = state.records.find((item) => item.id === button.dataset.id);
      if (!record) {
        return;
      }
      if (record.reviewStatus === "reviewed") {
        state.modalRecordId = record.id;
        state.calendarModalMode = "view";
        renderViewModal(record, getRecordsByDate(state.records, record.practiceDate));
        showCalendarModal();
      } else {
        switchModalToPlanEdit(record.id);
        showCalendarModal();
      }
    });
  });

  elements.recordList.querySelectorAll("[data-action='delete']").forEach((button) => {
    button.addEventListener("click", () => {
      deleteRecord(button.dataset.id);
    });
  });

  elements.recordList.querySelectorAll("[data-action='review']").forEach((button) => {
    button.addEventListener("click", () => {
      startReview(button.dataset.id);
    });
  });

  elements.recordList.querySelectorAll("[data-action='view']").forEach((button) => {
    button.addEventListener("click", () => {
      const record = getRecordById(button.dataset.id);
      if (!record) {
        return;
      }
      state.modalDate = record.practiceDate;
      state.modalRecordId = record.id;
      state.calendarModalMode = "view";
      renderViewModal(record, getRecordsByDate(state.records, record.practiceDate));
      showCalendarModal();
    });
  });
}

function renderRecordCard(record) {
  const goalBlocks = getGoalBlocksFromRecord(record);
  const completedMoves = getTotalCompletedCount([record]);
  const isReviewed = record.reviewStatus === "reviewed";
  return `
    <article class="record-card">
      <div class="record-topline">
        <strong>${PRACTICE_TYPE_LABELS[record.practiceType]} 연습</strong>
        <span class="record-meta">${formatMinutes(record.durationMinutes)} · 동작 수행 ${completedMoves}회</span>
      </div>

      <div class="tag-row">
        <span class="review-status-badge is-${record.reviewStatus}">${isReviewed ? "회고 완료" : "목표 등록"}</span>
        ${record.location ? `<span class="tag location-tag">장소: ${escapeHtml(record.location)}</span>` : ""}
        ${isReviewed ? `<span class="tag">컨디션 ${record.conditionScore}/5</span><span class="tag">만족도 ${record.satisfactionScore}/5</span>` : ""}
      </div>

      <div class="detail-block">
        <h4>오늘의 목표</h4>
        ${renderRecordGoalBlocks(goalBlocks, record.goal)}
        ${record.freeGoalText ? `<p class="stat-subtext">자유 목표: ${escapeHtml(record.freeGoalText)}</p>` : ""}
      </div>

      ${
        isReviewed
          ? `
            <div class="detail-block">
              <h4>연습한 내용</h4>
              <p>${escapeHtml(record.practiceNotes || "기록 없음")}</p>
            </div>

            <div class="detail-block">
              <h4>느낀 점</h4>
              <p>${escapeHtml(record.reflection || "기록 없음")}</p>
            </div>

            <div class="detail-block">
              <h4>다음 연습 과제</h4>
              <p>${escapeHtml(record.nextTask || "기록 없음")}</p>
            </div>
          `
          : ""
      }

      <div class="record-actions">
        <span class="record-meta">업데이트 ${formatRelativeDateTime(record.updatedAt)}</span>
        <div class="month-actions">
          <button class="accent-button" type="button" data-action="${isReviewed ? "view" : "review"}" data-id="${record.id}">${isReviewed ? "기록 보기" : "회고하기"}</button>
          <button class="ghost-button" type="button" data-action="edit" data-id="${record.id}">${isReviewed ? "수정" : "목표 수정"}</button>
          <button class="ghost-button" type="button" data-action="delete" data-id="${record.id}">삭제</button>
        </div>
      </div>
    </article>
  `;
}

function renderStats(monthRecords) {
  const totalMinutes = monthRecords.reduce((sum, record) => sum + record.durationMinutes, 0);
  const genreTotals = aggregateBy(monthRecords, "genre", "durationMinutes");
  const practiceTypeTotals = aggregateBy(monthRecords, "practiceType", "durationMinutes");
  const trendRows = buildSevenDayTrend(state.records, state.selectedDate);
  const moveStats = aggregateMoveStats(monthRecords);
  const reviewStats = getReviewStats(monthRecords);

  elements.statsGrid.innerHTML = `
    ${renderDashboardInsights(monthRecords)}

    <article class="stat-card">
      <h3>이번 달 목표 등록 수</h3>
      <div class="stat-value">${reviewStats.plannedCount}개</div>
      <p class="stat-subtext">기록이 있는 날짜 수 ${new Set(monthRecords.map((record) => record.practiceDate)).size}일</p>
    </article>

    <article class="stat-card">
      <h3>회고 완료 수</h3>
      <div class="stat-value">${reviewStats.reviewedCount}개</div>
      <p class="stat-subtext">목표 등록 후 회고까지 마친 기록입니다.</p>
    </article>

    <article class="stat-card">
      <h3>목표 체크 완료율</h3>
      <div class="stat-value">${reviewStats.checkRate}%</div>
      <p class="stat-subtext">${reviewStats.completedBlocks} / ${reviewStats.totalBlocks}개 동작 체크 완료</p>
    </article>

    <article class="stat-card">
      <h3>이번 달 총 연습 시간</h3>
      <div class="stat-value">${formatMinutes(totalMinutes)}</div>
      <p class="stat-subtext">1회 평균 ${monthRecords.length ? formatMinutes(Math.round(totalMinutes / monthRecords.length)) : "0분"}</p>
    </article>

    <article class="stat-card">
      <h3>개인/팀 연습 비율</h3>
      ${renderMiniBars(
        Object.entries(practiceTypeTotals).map(([type, minutes]) => ({
          label: PRACTICE_TYPE_LABELS[type],
          value: minutes,
          display: formatMinutes(minutes),
        })),
      )}
    </article>

    <article class="stat-card">
      <h3>최근 7일 연습 추이</h3>
      ${renderMiniBars(
        trendRows.map((row) => ({
          label: row.label,
          value: row.minutes,
          display: row.minutes ? formatMinutes(row.minutes) : "-",
        })),
      )}
    </article>

    <article class="stat-card">
      <h3>등록한 목표 동작 수</h3>
      <div class="stat-value">${moveStats.length}개</div>
      <p class="stat-subtext">가장 많이 등록한 동작: ${getMostPlannedMove(monthRecords)?.moveName || "없음"}</p>
    </article>

    <article class="stat-card">
      <div class="section-head">
        <div>
          <p class="section-kicker">Move Stats</p>
          <h3>동작별 통계</h3>
        </div>
        <button class="move-stat-toggle" type="button" data-action="toggle-move-stats">
          ${state.showAllMoveStats ? "TOP 5 보기" : "전체 동작 보기"}
        </button>
      </div>
      ${renderMoveStats(monthRecords, { limit: state.showAllMoveStats ? null : 5 })}
    </article>

    <article class="stat-card">
      <h3>MVP 구조 메모</h3>
      <p class="stat-subtext">
        현재 프로토타입은 로컬 저장 기반입니다. 기록 모델은 문서화되어 있어 이후 React, TypeScript, Tailwind, Firebase 또는 Supabase로 옮기기 쉽도록 설계했습니다.
      </p>
    </article>
  `;
}

function renderMiniBars(items) {
  if (!items.length || items.every((item) => item.value === 0)) {
    return `<div class="empty-state">아직 집계할 데이터가 없습니다.</div>`;
  }

  const maxValue = Math.max(...items.map((item) => item.value), 1);
  return `
    <div class="mini-bars">
      ${items
        .map(
          (item) => `
            <div class="mini-bar-row">
              <span>${item.label}</span>
              <div class="mini-bar-track">
                <div class="mini-bar-fill" style="width: ${(item.value / maxValue) * 100}%"></div>
              </div>
              <strong>${item.display}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function getSavedMoves(limit = 12) {
  const moves = new Map();
  state.records.forEach((record) => {
    getGoalBlocksFromRecord(record).forEach((block) => {
      const current = moves.get(block.moveName) || { moveName: block.moveName, count: 0 };
      current.count += 1;
      moves.set(block.moveName, current);
    });
  });

  return [...moves.values()].sort((a, b) => b.count - a.count || a.moveName.localeCompare(b.moveName, "ko")).slice(0, limit);
}

function renderRecordGoalBlocks(goalBlocks, fallbackGoal) {
  if (!goalBlocks.length) {
    return `<p>${escapeHtml(fallbackGoal || "기록 없음")}</p>`;
  }

  return `
    <div class="goal-block-list is-compact">
      ${goalBlocks
        .map((block) => {
          const statusClass = block.completed ? "is-complete" : "needs-work";
          const statusLabel = block.completed ? "완료" : "미완료";
          return `
            <div class="goal-block-card ${statusClass}">
              <div class="goal-block-main">
                <strong>${escapeHtml(block.moveName)}</strong>
                <span>${block.targetCount}회</span>
              </div>
              <div class="goal-block-meta">
                <span class="goal-status-badge ${statusClass}">${statusLabel}</span>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderMoveStats(records, options = {}) {
  const sortedMoveStats = aggregateMoveStats(records).sort((a, b) => b.completedCount - a.completedCount);
  const moveStats = options.limit ? sortedMoveStats.slice(0, options.limit) : sortedMoveStats;

  if (!moveStats.length) {
    return `<div class="empty-state">아직 집계할 목표 동작이 없습니다.</div>`;
  }

  return `
    <div class="move-stat-list">
      ${moveStats
        .map(
          (move) => `
            <div class="move-stat-row">
              <div>
                <div class="move-stat-title">${escapeHtml(move.moveName)}</div>
                <div class="move-stat-meta">${move.completedCount} / ${move.targetCount}회 · ${move.completionRate}% · ${move.recordCount}회 기록</div>
              </div>
              <div class="goal-progress">
                <div class="goal-progress-fill" style="width: ${Math.min(move.completionRate, 100)}%"></div>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderDashboardInsights(monthRecords) {
  const plannedMove = getMostPlannedMove(monthRecords);
  const completedMove = getMostCompletedMove(monthRecords);
  const goalSummary = getMonthlyGoalSummary(monthRecords);
  const conditionInsight = getConditionSatisfactionInsight(monthRecords);
  const balanceInsight = getPracticeBalanceInsight(monthRecords);

  return `
    <section class="dashboard-insight-grid">
      <article class="insight-card">
        <p class="section-kicker">Focus Move</p>
        <h3>가장 많이 등록한 동작</h3>
        <div class="insight-value">${plannedMove ? escapeHtml(plannedMove.moveName) : "아직 없음"}</div>
        <p class="insight-comment">
          ${plannedMove ? `${escapeHtml(plannedMove.moveName)} 목표를 ${plannedMove.recordCount}회 등록했어요.` : "목표를 등록하면 가장 자주 계획한 동작이 표시됩니다."}
        </p>
      </article>

      <article class="insight-card">
        <p class="section-kicker">Goal Rate</p>
        <h3>목표 체크 완료율</h3>
        <div class="insight-value">${goalSummary.completionRate}%</div>
        <p class="insight-comment">${goalSummary.completedCount} / ${goalSummary.targetCount}개 목표 체크 완료</p>
        <div class="goal-progress">
          <div class="goal-progress-fill" style="width: ${Math.min(goalSummary.completionRate, 100)}%"></div>
        </div>
      </article>

      <article class="insight-card">
        <p class="section-kicker">Completed Move</p>
        <h3>가장 자주 완료한 동작</h3>
        <div class="insight-value">${completedMove ? escapeHtml(completedMove.moveName) : "아직 없음"}</div>
        <p class="insight-comment">${completedMove ? `${completedMove.completedCount}회 수행으로 체크된 동작입니다.` : "회고에서 목표를 체크하면 완료 동작이 표시됩니다."}</p>
      </article>

      <article class="insight-card">
        <p class="section-kicker">Review Mood</p>
        <h3>회고 컨디션</h3>
        <div class="insight-value">${conditionInsight.avgCondition.toFixed(1)} / ${conditionInsight.avgSatisfaction.toFixed(1)}</div>
        <p class="insight-comment">${conditionInsight.comment} ${balanceInsight.comment}</p>
      </article>
    </section>
  `;
}

function getDateRecordStatus(dateKey) {
  const records = getRecordsByDate(state.records, dateKey);

  if (!records.length) {
    return {
      status: "empty",
      records: [],
      primaryRecord: null,
    };
  }

  // MVP는 날짜당 대표 기록 1개 중심으로 처리한다. 추후 여러 기록 선택 UI를 이 지점에 확장할 수 있다.
  const plannedRecord = records.find((record) => record.reviewStatus !== "reviewed");
  if (plannedRecord) {
    return {
      status: "planned",
      records,
      primaryRecord: plannedRecord,
    };
  }

  return {
    status: "reviewed",
    records,
    primaryRecord: records[0],
  };
}

function openCalendarModalForDate(dateKey) {
  const result = getDateRecordStatus(dateKey);
  state.modalDate = dateKey;
  state.modalRecordId = result.primaryRecord?.id || null;

  if (result.status === "empty") {
    state.calendarModalMode = "plan";
    state.modalDraftGoalBlocks = [];
    renderPlanModal(dateKey);
  } else if (result.status === "planned") {
    state.calendarModalMode = "review";
    state.modalDraftGoalBlocks = getGoalBlocksFromRecord(result.primaryRecord);
    renderReviewModal(result.primaryRecord);
  } else {
    state.calendarModalMode = "view";
    renderViewModal(result.primaryRecord, result.records);
  }

  showCalendarModal();
}

function showCalendarModal() {
  elements.calendarModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeCalendarModal() {
  elements.calendarModal.hidden = true;
  elements.calendarModalBody.innerHTML = "";
  state.calendarModalMode = null;
  state.modalDate = null;
  state.modalRecordId = null;
  state.modalDraftGoalBlocks = [];
  document.body.classList.remove("modal-open");
  render();
}

function showCelebration(message = "축하드려요. 오늘도 한걸음 성장하셨네요!") {
  if (!elements.celebrationOverlay) {
    return;
  }

  elements.celebrationOverlay.hidden = false;
  elements.celebrationOverlay.classList.remove("is-active");
  void elements.celebrationOverlay.offsetWidth;
  elements.celebrationOverlay.classList.add("is-active");

  const strongNode = elements.celebrationOverlay.querySelector("strong");
  const messageNode = elements.celebrationOverlay.querySelector("p");
  if (strongNode) {
    strongNode.textContent = "축하드려요.";
  }
  if (messageNode) {
    messageNode.textContent = message.replace("축하드려요. ", "");
  }

  window.setTimeout(() => {
    elements.celebrationOverlay.classList.remove("is-active");
    elements.celebrationOverlay.hidden = true;
  }, 2200);
}

function handleCalendarModalClick(event) {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) {
    return;
  }

  const { action, id } = actionTarget.dataset;
  if (action === "close-calendar-modal") {
    closeCalendarModal();
  } else if (action === "add-modal-goal-block") {
    addModalGoalBlock();
  } else if (action === "remove-modal-goal-block") {
    removeModalGoalBlock(id);
  } else if (action === "fill-modal-move") {
    fillModalMoveName(actionTarget.dataset.moveName);
  } else if (action === "submit-plan-modal") {
    submitPlanFromModal();
  } else if (action === "submit-review-modal") {
    submitReviewFromModal();
  } else if (action === "edit-plan-modal") {
    switchModalToPlanEdit(id);
  } else if (action === "edit-review-modal") {
    switchModalToReviewEdit(id);
  } else if (action === "delete-modal-record") {
    deleteRecord(id);
    closeCalendarModal();
  }
}

function renderPlanModal(dateKey, record = null) {
  state.modalRecordId = record?.id || null;
  state.modalDraftGoalBlocks = record ? getGoalBlocksFromRecord(record) : state.modalDraftGoalBlocks;
  elements.calendarModalKicker.textContent = state.calendarModalMode === "edit-plan" ? "Edit Plan" : "Plan";
  elements.calendarModalTitle.textContent = state.calendarModalMode === "edit-plan" ? "오늘의 목표 수정" : "오늘의 목표 등록";
  elements.calendarModalBody.innerHTML = `
    <form class="modal-form" id="modalPlanForm">
      <div class="form-error-message" id="modalFormError" hidden></div>
      <p class="form-section-description">연습 전에 오늘 할 동작과 자유 목표를 가볍게 적어보세요.</p>
      <div class="compact-form-grid">
        <label class="field">
          <span>연습 날짜</span>
          <input id="modalPracticeDate" type="date" required value="${escapeHtml(record?.practiceDate || dateKey)}" />
        </label>
        <label class="field">
          <span>연습 유형</span>
          <select id="modalPracticeType">
            <option value="solo" ${record?.practiceType === "solo" ? "selected" : ""}>개인</option>
            <option value="team" ${record?.practiceType === "team" ? "selected" : ""}>팀</option>
          </select>
        </label>
        <label class="field">
          <span>연습 시간(시간)</span>
          <input id="modalDurationHours" type="number" min="0" step="0.5" value="${formatHoursInputValue(record?.durationMinutes ?? 60)}" />
        </label>
        <label class="field">
          <span>장소</span>
          <input id="modalLocation" type="text" placeholder="예: 연습실, 집, 팀 스튜디오" value="${escapeHtml(record?.location || "")}" />
        </label>
      </div>
      <div class="modal-goal-builder">
        <div class="goal-builder-grid">
          <label class="field">
            <span>동작명</span>
            <input id="modalGoalMoveName" type="text" placeholder="예: 윈드밀, 프리즈, 탑락" />
          </label>
          <label class="field">
            <span>목표 횟수</span>
            <input id="modalGoalTargetCount" type="number" min="1" value="10" />
          </label>
        </div>
        <button class="ghost-button" type="button" data-action="add-modal-goal-block">목표 추가</button>
        <div>
          <p class="section-kicker">나의 등록 동작</p>
          <div class="saved-move-chips" id="modalSavedMoveChips"></div>
        </div>
        <div class="modal-goal-list" id="modalGoalBlockList"></div>
      </div>
      <label class="field">
        <span>자유 목표 메모</span>
        <textarea id="modalFreeGoalText" rows="3" placeholder="연습할 목표를 자유롭게 메모해보세요">${escapeHtml(record?.freeGoalText || "")}</textarea>
      </label>
      <div class="modal-action-row">
        <button class="ghost-button" type="button" data-action="close-calendar-modal">닫기</button>
        <button class="accent-button" type="button" data-action="submit-plan-modal">목표 저장</button>
      </div>
    </form>
  `;
  renderModalGoalBlockEditor();
  renderModalSavedMoveChips();
  document.getElementById("modalGoalMoveName")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addModalGoalBlock();
    }
  });
}

function validatePlanModal() {
  const errorNode = document.getElementById("modalFormError");
  const dateValue = document.getElementById("modalPracticeDate")?.value;
  const freeGoalText = document.getElementById("modalFreeGoalText")?.value.trim() || "";
  const durationHours = Number(document.getElementById("modalDurationHours")?.value || 0);

  const renderError = (message) => {
    errorNode.textContent = message;
    errorNode.hidden = false;
    return false;
  };

  if (!dateValue) {
    return renderError("연습 날짜를 선택해주세요.");
  }
  if (!state.modalDraftGoalBlocks.length && !freeGoalText) {
    return renderError("목표 동작을 추가하거나 자유 목표를 입력해주세요.");
  }
  if (Number.isNaN(durationHours) || durationHours < 0) {
    return renderError("연습 시간은 0 이상이어야 합니다.");
  }

  errorNode.textContent = "";
  errorNode.hidden = true;
  return true;
}

function submitPlanFromModal() {
  if (!validatePlanModal()) {
    return;
  }

  const existingRecord = state.modalRecordId ? getRecordById(state.modalRecordId) : null;
  const goalBlocks = state.modalDraftGoalBlocks.map(normalizeGoalBlock);
  const freeGoalText = document.getElementById("modalFreeGoalText").value.trim();
  const goal = summarizeGoalText(goalBlocks, freeGoalText);
  const record = {
    id: existingRecord?.id || createId(),
    profileId: state.profile?.id || existingRecord?.profileId || null,
    teamId: state.profile?.teamId || existingRecord?.teamId || null,
    practiceDate: document.getElementById("modalPracticeDate").value,
    practiceType: document.getElementById("modalPracticeType").value,
    genre: state.profile?.mainGenre || existingRecord?.genre || "other",
    durationMinutes: hoursToMinutes(document.getElementById("modalDurationHours").value),
    goal,
    goalBlocks,
    freeGoalText,
    practiceNotes: existingRecord?.practiceNotes || "",
    reflection: existingRecord?.reflection || "",
    nextTask: existingRecord?.nextTask || "",
    conditionScore: existingRecord?.conditionScore || 3,
    satisfactionScore: existingRecord?.satisfactionScore || 3,
    location: document.getElementById("modalLocation").value.trim(),
    reviewStatus: existingRecord?.reviewStatus || "planned",
    goalCompleted: existingRecord?.reviewStatus === "reviewed" ? isGoalBlocksCompleted(goalBlocks) : false,
    createdAt: existingRecord?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  upsertRecordObject(record);
  closeCalendarModal();
}

function renderModalGoalBlockEditor() {
  const list = document.getElementById("modalGoalBlockList");
  if (!list) {
    return;
  }
  if (!state.modalDraftGoalBlocks.length) {
    list.innerHTML = `<div class="empty-state">추가된 목표 동작이 없습니다.</div>`;
    return;
  }
  list.innerHTML = state.modalDraftGoalBlocks
    .map(
      (block) => `
        <article class="goal-block-card">
          <div class="goal-block-main">
            <strong>${escapeHtml(block.moveName)}</strong>
            <span>목표 ${block.targetCount}회</span>
          </div>
          <div class="goal-block-meta">
            <span>회고에서 완료 체크</span>
            <button class="goal-remove-button" type="button" data-action="remove-modal-goal-block" data-id="${block.id}">삭제</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function addModalGoalBlock() {
  const moveNameInput = document.getElementById("modalGoalMoveName");
  const targetCountInput = document.getElementById("modalGoalTargetCount");
  const moveName = moveNameInput.value.trim();
  if (!moveName) {
    moveNameInput.focus();
    return;
  }
  state.modalDraftGoalBlocks.push(
    normalizeGoalBlock({
      id: createScopedId("goal"),
      moveName,
      targetCount: Math.max(Number(targetCountInput.value) || 1, 1),
      completedCount: 0,
      completed: false,
    }),
  );
  moveNameInput.value = "";
  targetCountInput.value = "10";
  renderModalGoalBlockEditor();
}

function removeModalGoalBlock(goalBlockId) {
  state.modalDraftGoalBlocks = state.modalDraftGoalBlocks.filter((block) => block.id !== goalBlockId);
  renderModalGoalBlockEditor();
}

function renderModalSavedMoveChips() {
  const container = document.getElementById("modalSavedMoveChips");
  if (!container) {
    return;
  }
  const savedMoves = getSavedMoves();
  if (!savedMoves.length) {
    container.innerHTML = `<span class="stat-subtext">아직 등록한 동작이 없습니다.</span>`;
    return;
  }
  container.innerHTML = savedMoves
    .map((move) => `<button class="saved-move-chip" type="button" data-action="fill-modal-move" data-move-name="${escapeHtml(move.moveName)}">${escapeHtml(move.moveName)}</button>`)
    .join("");
}

function fillModalMoveName(moveName) {
  const input = document.getElementById("modalGoalMoveName");
  input.value = moveName;
  input.focus();
}

function renderReviewModal(record) {
  state.modalRecordId = record.id;
  elements.calendarModalKicker.textContent = state.calendarModalMode === "edit-review" ? "Edit Review" : "Review";
  elements.calendarModalTitle.textContent = "연습 회고";
  elements.calendarModalBody.innerHTML = `
    <form class="modal-form">
      <div class="form-error-message" id="modalReviewError" hidden></div>
      <p class="form-section-description">연습 전에 세운 목표를 실제로 했는지 체크하고 짧게 회고해보세요.</p>
      <div class="modal-summary-block">
        <strong>${formatSelectedDate(record.practiceDate)}</strong>
        <span>${record.location ? `장소: ${escapeHtml(record.location)}` : "장소 미입력"}</span>
        ${record.freeGoalText ? `<p>자유 목표: ${escapeHtml(record.freeGoalText)}</p>` : ""}
      </div>
      <div class="modal-review-checklist" id="modalReviewChecklist">
        ${renderModalReviewChecklist(record)}
      </div>
      <label class="field">
        <span>연습한 내용</span>
        <textarea id="modalReviewPracticeNotes" rows="3" placeholder="체크만 해도 저장할 수 있어요.">${escapeHtml(record.reviewStatus === "reviewed" ? record.practiceNotes || "" : "")}</textarea>
      </label>
      <label class="field">
        <span>느낀 점</span>
        <textarea id="modalReviewReflection" rows="2">${escapeHtml(record.reviewStatus === "reviewed" ? record.reflection || "" : "")}</textarea>
      </label>
      <label class="field">
        <span>다음 연습 과제</span>
        <textarea id="modalReviewNextTask" rows="2">${escapeHtml(record.reviewStatus === "reviewed" ? record.nextTask || "" : "")}</textarea>
      </label>
      <div class="field-row">
        <label class="field">
          <span>컨디션 점수</span>
          <input id="modalReviewConditionScore" type="range" min="1" max="5" value="${record.conditionScore || 3}" />
          <strong class="range-value" id="modalReviewConditionValue">${record.conditionScore || 3}</strong>
        </label>
        <label class="field">
          <span>만족도 점수</span>
          <input id="modalReviewSatisfactionScore" type="range" min="1" max="5" value="${record.satisfactionScore || 3}" />
          <strong class="range-value" id="modalReviewSatisfactionValue">${record.satisfactionScore || 3}</strong>
        </label>
      </div>
      <div class="modal-action-row">
        <button class="ghost-button" type="button" data-action="close-calendar-modal">닫기</button>
        <button class="accent-button" type="button" data-action="submit-review-modal">회고 저장</button>
      </div>
    </form>
  `;
  document.getElementById("modalReviewConditionScore").addEventListener("input", (event) => {
    document.getElementById("modalReviewConditionValue").textContent = event.target.value;
  });
  document.getElementById("modalReviewSatisfactionScore").addEventListener("input", (event) => {
    document.getElementById("modalReviewSatisfactionValue").textContent = event.target.value;
  });
}

function renderModalReviewChecklist(record) {
  const goalBlocks = getGoalBlocksFromRecord(record);
  if (!goalBlocks.length) {
    return `<div class="empty-state">체크할 목표 동작이 없습니다. 회고만 저장할 수 있습니다.</div>`;
  }
  return goalBlocks
    .map(
      (block) => `
        <label class="review-check-item">
          <input type="checkbox" data-goal-id="${block.id}" ${block.completed ? "checked" : ""} />
          <span>${escapeHtml(block.moveName)} ${block.targetCount}회</span>
        </label>
      `,
    )
    .join("");
}

function submitReviewFromModal() {
  const record = getRecordById(state.modalRecordId);
  if (!record) {
    return;
  }
  const checkedIds = new Set(
    [...document.querySelectorAll("#modalReviewChecklist [data-goal-id]")]
      .filter((input) => input.checked)
      .map((input) => input.dataset.goalId),
  );
  const goalBlocks = getGoalBlocksFromRecord(record).map((block) => {
    const completed = checkedIds.has(block.id);
    return {
      ...block,
      completed,
      completedCount: completed ? block.targetCount : 0,
    };
  });
  const updatedRecord = {
    ...record,
    goalBlocks,
    goal: summarizeGoalText(goalBlocks, record.freeGoalText || ""),
    practiceNotes: document.getElementById("modalReviewPracticeNotes").value.trim(),
    reflection: document.getElementById("modalReviewReflection").value.trim(),
    nextTask: document.getElementById("modalReviewNextTask").value.trim(),
    conditionScore: Number(document.getElementById("modalReviewConditionScore").value),
    satisfactionScore: Number(document.getElementById("modalReviewSatisfactionScore").value),
    reviewStatus: "reviewed",
    goalCompleted: goalBlocks.length ? goalBlocks.every((block) => block.completed) : Boolean(record.freeGoalText),
    updatedAt: new Date().toISOString(),
  };
  upsertRecordObject(updatedRecord);
  closeCalendarModal();
  showCelebration();
}

function renderViewModal(record, records = [record]) {
  elements.calendarModalKicker.textContent = records.length > 1 ? `${records.length} Records` : "Record";
  elements.calendarModalTitle.textContent = "연습 기록 확인";
  elements.calendarModalBody.innerHTML = `
    <div class="modal-form">
      <div class="modal-summary-block">
        <strong>${formatSelectedDate(record.practiceDate)}</strong>
        <span>${PRACTICE_TYPE_LABELS[record.practiceType]} 연습 · ${formatMinutes(record.durationMinutes)}</span>
        ${record.location ? `<span>장소: ${escapeHtml(record.location)}</span>` : ""}
      </div>
      ${record.freeGoalText ? `<div class="detail-block"><h4>자유 목표 메모</h4><p>${escapeHtml(record.freeGoalText)}</p></div>` : ""}
      <div class="detail-block">
        <h4>목표 동작</h4>
        ${renderRecordGoalBlocks(getGoalBlocksFromRecord(record), record.goal)}
      </div>
      <div class="detail-block"><h4>연습한 내용</h4><p>${escapeHtml(record.practiceNotes || "기록 없음")}</p></div>
      <div class="detail-block"><h4>느낀 점</h4><p>${escapeHtml(record.reflection || "기록 없음")}</p></div>
      <div class="detail-block"><h4>다음 연습 과제</h4><p>${escapeHtml(record.nextTask || "기록 없음")}</p></div>
      <div class="tag-row">
        <span class="tag">컨디션 ${record.conditionScore}/5</span>
        <span class="tag">만족도 ${record.satisfactionScore}/5</span>
      </div>
      <div class="modal-action-row">
        <button class="ghost-button" type="button" data-action="edit-plan-modal" data-id="${record.id}">목표 수정</button>
        <button class="ghost-button" type="button" data-action="edit-review-modal" data-id="${record.id}">회고 수정</button>
        <button class="ghost-button" type="button" data-action="delete-modal-record" data-id="${record.id}">삭제</button>
        <button class="accent-button" type="button" data-action="close-calendar-modal">닫기</button>
      </div>
    </div>
  `;
}

function switchModalToPlanEdit(recordId) {
  const record = getRecordById(recordId);
  if (!record) {
    return;
  }
  state.calendarModalMode = "edit-plan";
  state.modalDate = record.practiceDate;
  state.modalRecordId = record.id;
  renderPlanModal(record.practiceDate, record);
}

function switchModalToReviewEdit(recordId) {
  const record = getRecordById(recordId);
  if (!record) {
    return;
  }
  state.calendarModalMode = "edit-review";
  state.modalDate = record.practiceDate;
  state.modalRecordId = record.id;
  renderReviewModal(record);
}

function upsertRecordObject(record) {
  const existingIndex = state.records.findIndex((item) => item.id === record.id);
  if (existingIndex >= 0) {
    state.records.splice(existingIndex, 1, record);
  } else {
    state.records.push(record);
  }
  state.records.sort((a, b) => a.practiceDate.localeCompare(b.practiceDate) || a.createdAt.localeCompare(b.createdAt));
  state.selectedDate = record.practiceDate;
  state.currentMonth = getMonthStart(parseDateKey(record.practiceDate));
  persistRecords();
}

function deleteRecord(recordId) {
  state.records = state.records.filter((record) => record.id !== recordId);
  if (state.editingRecordId === recordId) {
    state.editingRecordId = null;
  }
  if (state.reviewingRecordId === recordId) {
    state.reviewingRecordId = null;
  }

  persistRecords();
  render();
}

function startReview(recordId) {
  const record = getRecordById(recordId);
  if (!record) {
    return;
  }

  state.reviewingRecordId = record.id;
  state.modalDate = record.practiceDate;
  state.modalRecordId = record.id;
  state.calendarModalMode = record.reviewStatus === "reviewed" ? "edit-review" : "review";
  renderReviewModal(record);
  showCalendarModal();
}

function loadProfile() {
  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    const migratedProfile = migrateProfileToImageAvatar(parsed);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(migratedProfile));
    return migratedProfile;
  } catch (error) {
    console.error("Failed to parse profile from storage.", error);
    return null;
  }
}

function persistProfile() {
  if (!state.profile) {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    return;
  }
  state.profile = normalizeProfileAvatar(state.profile);
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.profile));
}

function loadTeams() {
  const raw = window.localStorage.getItem(TEAMS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse teams from storage.", error);
    return [];
  }
}

function persistTeams() {
  window.localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(state.teams));
}

function migrateLegacyRecords(records) {
  return records.map((record) => {
    const now = new Date().toISOString();
    const reviewStatus =
      record.reviewStatus || (record.practiceNotes || record.reflection || record.nextTask ? "reviewed" : "planned");
    const goalBlocks = Array.isArray(record.goalBlocks) && record.goalBlocks.length
      ? record.goalBlocks.map(normalizeGoalBlock)
      : record.goal
        ? [
            normalizeGoalBlock({
              id: createScopedId("goal"),
              moveName: record.goal,
              targetCount: 1,
              completedCount: record.goalCompleted ? 1 : 0,
            }),
          ]
        : [];

    return {
      ...record,
      profileId: record.profileId || null,
      teamId: record.teamId || null,
      practiceType: record.practiceType || "solo",
      genre: record.genre || "other",
      durationMinutes: Number(record.durationMinutes) || 0,
      freeGoalText: typeof record.freeGoalText === "string" ? record.freeGoalText : goalBlocks.length ? "" : record.goal || "",
      goal: record.goal || summarizeGoalText(goalBlocks, typeof record.freeGoalText === "string" ? record.freeGoalText : goalBlocks.length ? "" : record.goal || ""),
      goalBlocks,
      practiceNotes: record.practiceNotes || "",
      reflection: record.reflection || "",
      nextTask: record.nextTask || "",
      conditionScore: Number(record.conditionScore) || 3,
      satisfactionScore: Number(record.satisfactionScore) || 3,
      location: record.location || "",
      reviewStatus,
      goalCompleted:
        typeof record.goalCompleted === "boolean" ? record.goalCompleted : isGoalBlocksCompleted(goalBlocks),
      createdAt: record.createdAt || now,
      updatedAt: record.updatedAt || record.createdAt || now,
    };
  });
}

function normalizeGoalBlock(block) {
  const targetCount = Math.max(Number(block?.targetCount) || 1, 1);
  const completed = typeof block?.completed === "boolean"
    ? block.completed
    : Math.max(Number(block?.completedCount) || 0, 0) >= targetCount;
  return {
    id: block?.id || createScopedId("goal"),
    moveName: String(block?.moveName || "이름 없는 동작").trim() || "이름 없는 동작",
    targetCount,
    completedCount: completed ? targetCount : Math.max(Number(block?.completedCount) || 0, 0),
    completed,
  };
}

function getGoalBlocksFromRecord(record) {
  if (Array.isArray(record.goalBlocks) && record.goalBlocks.length) {
    return record.goalBlocks.map(normalizeGoalBlock);
  }

  if (!record.goal) {
    return [];
  }

  return [
    normalizeGoalBlock({
      id: createScopedId("goal"),
      moveName: record.goal,
      targetCount: 1,
      completedCount: record.goalCompleted ? 1 : 0,
    }),
  ];
}

function summarizeGoalBlocks(goalBlocks) {
  if (!goalBlocks.length) {
    return "";
  }

  return goalBlocks
    .map((block) => `${block.moveName} ${block.targetCount}회`)
    .join(", ");
}

function summarizeGoalText(goalBlocks, freeGoalText = "") {
  const blockSummary = summarizeGoalBlocks(goalBlocks);
  const cleanFreeGoalText = freeGoalText.trim();
  if (blockSummary && cleanFreeGoalText) {
    return `동작 목표: ${blockSummary} / 자유 목표: ${cleanFreeGoalText}`;
  }
  if (blockSummary) {
    return blockSummary;
  }
  return cleanFreeGoalText;
}

function isGoalBlocksCompleted(goalBlocks) {
  return Boolean(goalBlocks.length) && goalBlocks.every((block) => block.completed);
}

function calculateGoalBlockCompletion(goalBlock) {
  if (!goalBlock.targetCount) {
    return 0;
  }
  return Math.round((goalBlock.completedCount / goalBlock.targetCount) * 100);
}

function getTotalCompletedCount(records) {
  return records.reduce(
    (sum, record) =>
      sum + getGoalBlocksFromRecord(record).reduce((blockSum, block) => blockSum + (block.completed ? block.targetCount : 0), 0),
    0,
  );
}

function aggregateMoveStats(records) {
  const moveMap = records.reduce((accumulator, record) => {
    const movesInRecord = new Set();
    getGoalBlocksFromRecord(record).forEach((block) => {
      const current = accumulator.get(block.moveName) || {
        moveName: block.moveName,
        targetCount: 0,
        completedCount: 0,
        recordCount: 0,
      };

      current.targetCount += block.targetCount;
      current.completedCount += block.completedCount;
      if (!movesInRecord.has(block.moveName)) {
        current.recordCount += 1;
        movesInRecord.add(block.moveName);
      }
      accumulator.set(block.moveName, current);
    });
    return accumulator;
  }, new Map());

  return [...moveMap.values()].map((move) => ({
    ...move,
    completionRate: move.targetCount ? Math.round((move.completedCount / move.targetCount) * 100) : 0,
  }));
}

function getMonthlyGoalSummary(monthRecords) {
  const blocks = monthRecords.flatMap(getGoalBlocksFromRecord);
  const targetCount = blocks.length;
  const completedCount = blocks.filter((block) => block.completed).length;
  return {
    targetCount,
    completedCount,
    completionRate: targetCount ? Math.round((completedCount / targetCount) * 100) : 0,
  };
}

function getTopMove(monthRecords) {
  return getMostCompletedMove(monthRecords) || getMostPlannedMove(monthRecords);
}

function getReviewStats(monthRecords) {
  const plannedCount = monthRecords.length;
  const reviewedCount = monthRecords.filter((record) => record.reviewStatus === "reviewed").length;
  const blocks = monthRecords.flatMap(getGoalBlocksFromRecord);
  const completedBlocks = blocks.filter((block) => block.completed).length;
  return {
    plannedCount,
    reviewedCount,
    totalBlocks: blocks.length,
    completedBlocks,
    checkRate: blocks.length ? Math.round((completedBlocks / blocks.length) * 100) : 0,
  };
}

function getMostPlannedMove(monthRecords) {
  return aggregateMoveStats(monthRecords).sort((a, b) => b.recordCount - a.recordCount)[0] || null;
}

function getMostCompletedMove(monthRecords) {
  return aggregateMoveStats(monthRecords).sort((a, b) => b.completedCount - a.completedCount)[0] || null;
}

function getConditionSatisfactionInsight(monthRecords) {
  const avgCondition = average(monthRecords.map((record) => record.conditionScore));
  const avgSatisfaction = average(monthRecords.map((record) => record.satisfactionScore));
  let comment = "기록을 추가하면 컨디션과 만족도 흐름이 보입니다.";

  if (monthRecords.length) {
    if (avgCondition >= 3.5 && avgSatisfaction >= 3.5) {
      comment = "몸 상태와 성취감이 모두 좋은 달이에요.";
    } else if (avgCondition < 3.5 && avgSatisfaction >= 3.5) {
      comment = "몸은 무거웠지만 연습 성취감은 있었어요.";
    } else if (avgCondition >= 3.5 && avgSatisfaction < 3.5) {
      comment = "몸 상태는 괜찮지만 목표 설정이나 난이도 조정이 필요해 보여요.";
    } else {
      comment = "회복과 연습 강도 조절이 필요한 달이에요.";
    }
  }

  return { avgCondition, avgSatisfaction, comment };
}

function getPracticeBalanceInsight(monthRecords) {
  if (!monthRecords.length) {
    return {
      primaryLabel: "기록 없음",
      comment: "이번 달 기록을 추가하면 연습 균형이 표시됩니다.",
    };
  }

  const soloCount = monthRecords.filter((record) => record.practiceType === "solo").length;
  const teamCount = monthRecords.filter((record) => record.practiceType === "team").length;
  const genreTotals = aggregateBy(monthRecords, "genre", "durationMinutes");
  const topGenre = Object.entries(genreTotals).sort((a, b) => b[1] - a[1])[0];

  return {
    primaryLabel: teamCount > soloCount ? "팀 중심" : "개인 중심",
    comment:
      teamCount > soloCount
        ? `팀 연습 기록이 많아 합 맞추기 중심의 달이에요. 주 장르는 ${GENRE_LABELS[topGenre?.[0]] || "기록 없음"}입니다.`
        : `이번 달은 개인 연습 비중이 높아요. 주 장르는 ${GENRE_LABELS[topGenre?.[0]] || "기록 없음"}입니다.`,
  };
}

function toggleMoveStatsView() {
  state.showAllMoveStats = !state.showAllMoveStats;
  render();
}

function getReviewLevel(checkRate) {
  if (checkRate >= 80) {
    return 3;
  }
  if (checkRate >= 40) {
    return 2;
  }
  if (checkRate > 0) {
    return 1;
  }
  return 0;
}

function getDayReviewStatus(records) {
  if (!records.length) {
    return "";
  }
  return records.some((record) => record.reviewStatus !== "reviewed") ? "planned" : "reviewed";
}

function getDayGoalCheckRate(records) {
  const blocks = records.flatMap(getGoalBlocksFromRecord);
  if (!blocks.length) {
    return 0;
  }
  return Math.round((blocks.filter((block) => block.completed).length / blocks.length) * 100);
}

function loadRecords() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const migratedMockRecords = migrateLegacyRecords(mockRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedMockRecords));
    return migratedMockRecords;
  }

  try {
    const parsed = JSON.parse(raw);
    const migratedRecords = Array.isArray(parsed) ? migrateLegacyRecords(parsed) : migrateLegacyRecords(mockRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedRecords));
    return migratedRecords;
  } catch (error) {
    console.error("Failed to parse records from storage.", error);
    return migrateLegacyRecords(mockRecords);
  }
}

function persistRecords() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function buildCalendarDays(monthDate) {
  // Render a fixed 6-week grid so the calendar layout stays stable across months.
  const firstDay = getMonthStart(monthDate);
  const firstGridDate = new Date(firstDay);
  firstGridDate.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDate);
    date.setDate(firstGridDate.getDate() + index);
    return {
      date,
      isCurrentMonth: date.getMonth() === firstDay.getMonth(),
    };
  });
}

function getMonthRecords(records, monthDate) {
  const targetMonth = monthDate.getMonth();
  const targetYear = monthDate.getFullYear();

  return records.filter((record) => {
    const date = parseDateKey(record.practiceDate);
    return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
  });
}

function getRecordsByDate(records, dateKey) {
  return records.filter((record) => record.practiceDate === dateKey);
}

function getRecordById(recordId) {
  return state.records.find((record) => record.id === recordId);
}

function buildSevenDayTrend(records, referenceDateKey) {
  const referenceDate = parseDateKey(referenceDateKey);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setDate(referenceDate.getDate() - (6 - index));
    const dateKey = formatDateKey(date);
    const minutes = getRecordsByDate(records, dateKey).reduce((sum, record) => sum + record.durationMinutes, 0);
    return {
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      minutes,
    };
  });
}

function aggregateBy(records, key, valueKey) {
  return records.reduce((accumulator, record) => {
    const next = { ...accumulator };
    next[record[key]] = (next[record[key]] || 0) + Number(record[valueKey]);
    return next;
  }, {});
}

function getIntensityLevel(totalMinutes) {
  if (totalMinutes >= 150) {
    return 3;
  }
  if (totalMinutes >= 80) {
    return 2;
  }
  return 1;
}

function average(values) {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatMonthLabel(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function formatSelectedDate(dateKey) {
  const date = parseDateKey(dateKey);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAY_LABELS[date.getDay()]}요일`;
}

function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) {
    return `${minutes}분`;
  }
  if (!minutes) {
    return `${hours}시간`;
  }
  return `${hours}시간 ${minutes}분`;
}

function formatHoursInputValue(totalMinutes) {
  const hours = (Number(totalMinutes) || 0) / 60;
  return Number.isInteger(hours) ? String(hours) : String(Number(hours.toFixed(2)));
}

function hoursToMinutes(value) {
  return Math.round((Number(value) || 0) * 60);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function formatRelativeDateTime(isoString) {
  const date = new Date(isoString);
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createId() {
  return `rec-${crypto.randomUUID()}`;
}

function createScopedId(scope) {
  return `${scope}-${crypto.randomUUID()}`;
}
