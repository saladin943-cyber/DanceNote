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
  other: "기타",
};
const PRACTICE_TYPE_LABELS = {
  solo: "개인",
  team: "팀",
};
const AVATAR_OPTIONS = {
  hat: {
    none: "없음",
    cap: "볼캡",
    beanie: "비니",
    bucket: "버킷햇",
  },
  top: {
    tshirt: "기본 티셔츠",
    hoodie: "후디",
    overshirt: "오버핏 셔츠",
    jacket: "트레이닝 자켓",
  },
  bottom: {
    jogger: "조거팬츠",
    wide: "와이드팬츠",
    shorts: "쇼츠",
    track: "트레이닝팬츠",
  },
  shoes: {
    sneaker: "스니커즈",
    hightop: "하이탑",
    dance: "댄스화",
  },
  pose: {
    idle: "기본 서기",
    groove: "그루브",
    freeze: "프리즈",
    wave: "손 인사",
    team: "팀 포즈",
  },
};
const DEFAULT_AVATAR = {
  hat: "none",
  top: "tshirt",
  bottom: "jogger",
  shoes: "sneaker",
  pose: "idle",
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
  activeTab: "home",
  draftGoalBlocks: [],
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
  formTitle: document.getElementById("formTitle"),
  recordForm: document.getElementById("recordForm"),
  recordId: document.getElementById("recordId"),
  practiceDate: document.getElementById("practiceDate"),
  practiceType: document.getElementById("practiceType"),
  genre: document.getElementById("genre"),
  durationMinutes: document.getElementById("durationMinutes"),
  goal: document.getElementById("goal"),
  goalMoveName: document.getElementById("goalMoveName"),
  goalTargetCount: document.getElementById("goalTargetCount"),
  goalCompletedCount: document.getElementById("goalCompletedCount"),
  addGoalBlockButton: document.getElementById("addGoalBlockButton"),
  goalBlockList: document.getElementById("goalBlockList"),
  recentMoveChips: document.getElementById("recentMoveChips"),
  quickTemplateChips: document.getElementById("quickTemplateChips"),
  formErrorMessage: document.getElementById("formErrorMessage"),
  practiceNotes: document.getElementById("practiceNotes"),
  reflection: document.getElementById("reflection"),
  nextTask: document.getElementById("nextTask"),
  location: document.getElementById("location"),
  conditionScore: document.getElementById("conditionScore"),
  satisfactionScore: document.getElementById("satisfactionScore"),
  conditionValue: document.getElementById("conditionValue"),
  satisfactionValue: document.getElementById("satisfactionValue"),
  goalCompleted: document.getElementById("goalCompleted"),
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
  setFormDate(state.selectedDate);
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
    setFormDate(state.selectedDate);
    render();
  });

  elements.newRecordButton.addEventListener("click", () => {
    state.editingRecordId = null;
    resetForm({ preserveDate: true });
    focusForm();
  });

  elements.resetFormButton.addEventListener("click", () => {
    state.editingRecordId = null;
    resetForm({ preserveDate: true });
  });

  elements.recordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    upsertRecord();
  });

  elements.conditionScore.addEventListener("input", () => {
    elements.conditionValue.textContent = elements.conditionScore.value;
  });

  elements.satisfactionScore.addEventListener("input", () => {
    elements.satisfactionValue.textContent = elements.satisfactionScore.value;
  });

  elements.addGoalBlockButton.addEventListener("click", addGoalBlock);

  elements.goalMoveName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addGoalBlock();
    }
  });

  elements.statsGrid.addEventListener("click", (event) => {
    if (event.target.matches("[data-action='toggle-move-stats']")) {
      toggleMoveStatsView();
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
  renderGoalBlockEditor();
  renderRecentMoveChips();
  renderQuickTemplates();
  renderFormState();
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

  const team = getProfileTeam();
  const monthRecords = getMonthRecords(state.records, state.currentMonth);
  const topMove = getTopMove(monthRecords);
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
            <span>현재 포즈</span>
            <strong>${AVATAR_OPTIONS.pose[state.profile.avatar.pose]}</strong>
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

        <div class="customizer-grid">
          ${renderAvatarFields("setup", DEFAULT_AVATAR)}
        </div>

        <button class="accent-button" type="submit">캐릭터 생성하기</button>
      </form>
    </section>
  `;
  bindHomeEvents();
}

function renderPersonalRoom() {
  return `
    <div class="avatar-room personal-room">
      <div class="room-wall">
        <div class="room-light"></div>
        <div class="room-mirror"></div>
        <div class="room-speaker"></div>
      </div>
      <div class="room-floor">
        ${renderAvatar(state.profile, { label: state.profile.dancerName })}
      </div>
    </div>
  `;
}

function renderTeamRoom(team) {
  const mockMembers = [
    {
      id: "mock-1",
      dancerName: "Beat",
      mainGenre: team.genre,
      avatar: { hat: "cap", top: "jacket", bottom: "track", shoes: "hightop", pose: "groove" },
    },
    {
      id: "mock-2",
      dancerName: "Line",
      mainGenre: team.genre,
      avatar: { hat: "beanie", top: "overshirt", bottom: "wide", shoes: "dance", pose: "wave" },
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
      <div class="room-wall">
        <div class="room-light"></div>
        <div class="room-mirror"></div>
        <div class="room-speaker"></div>
      </div>
      <div class="room-floor team-floor">
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
  const avatar = { ...DEFAULT_AVATAR, ...(profile.avatar || {}) };
  const sizeClass = options.size === "small" ? "is-small" : "";
  const mockClass = options.isMock ? "is-mock" : "";
  const label = options.label || profile.dancerName;

  return `
    <div class="dancer-avatar ${sizeClass} ${mockClass} avatar-pose-${avatar.pose} avatar-top-${avatar.top} avatar-bottom-${avatar.bottom} avatar-shoes-${avatar.shoes}">
      <div class="avatar-hat avatar-hat-${avatar.hat}">${avatar.hat === "none" ? "" : AVATAR_OPTIONS.hat[avatar.hat]}</div>
      <div class="avatar-head"></div>
      <div class="avatar-arms"></div>
      <div class="avatar-body">${AVATAR_OPTIONS.top[avatar.top]}</div>
      <div class="avatar-legs">${AVATAR_OPTIONS.bottom[avatar.bottom]}</div>
      <div class="avatar-shoes">${AVATAR_OPTIONS.shoes[avatar.shoes]}</div>
      <div class="avatar-label">${escapeHtml(label)}</div>
    </div>
  `;
}

function renderAvatarUpdateForm() {
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
      <div class="customizer-grid">
        ${renderAvatarFields("update", { ...DEFAULT_AVATAR, ...state.profile.avatar })}
      </div>
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

function renderAvatarFields(prefix, avatar) {
  return Object.entries(AVATAR_OPTIONS)
    .map(([key, options]) => {
      const fieldId = `${prefix}${capitalize(key)}`;
      return `
        <label class="field">
          <span>${getAvatarFieldLabel(key)}</span>
          <select id="${fieldId}" name="${key}">
            ${Object.entries(options)
              .map(
                ([value, label]) =>
                  `<option value="${value}" ${avatar[key] === value ? "selected" : ""}>${label}</option>`,
              )
              .join("")}
          </select>
        </label>
      `;
    })
    .join("");
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
}

function createProfileFromForm() {
  const now = new Date().toISOString();
  const teamMode = document.getElementById("setupTeamMode").value;
  const dancerName = document.getElementById("setupDancerName").value.trim();
  const profile = {
    id: createScopedId("profile"),
    dancerName,
    mainGenre: document.getElementById("setupMainGenre").value,
    teamId: null,
    avatar: readAvatarFromForm("setup"),
    createdAt: now,
    updatedAt: now,
  };

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
    avatar: readAvatarFromForm("update"),
    updatedAt: new Date().toISOString(),
  };
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

function readAvatarFromForm(prefix) {
  return {
    hat: document.getElementById(`${prefix}Hat`).value,
    top: document.getElementById(`${prefix}Top`).value,
    bottom: document.getElementById(`${prefix}Bottom`).value,
    shoes: document.getElementById(`${prefix}Shoes`).value,
    pose: document.getElementById(`${prefix}Pose`).value,
  };
}

function renderGenreOptions(selectedValue = "breaking") {
  return Object.entries(GENRE_LABELS)
    .map(([value, label]) => `<option value="${value}" ${value === selectedValue ? "selected" : ""}>${label}</option>`)
    .join("");
}

function getAvatarFieldLabel(key) {
  const labels = {
    hat: "모자",
    top: "상의",
    bottom: "하의",
    shoes: "신발",
    pose: "포즈",
  };
  return labels[key];
}

function renderHero(monthRecords) {
  const totalMinutes = monthRecords.reduce((sum, record) => sum + record.durationMinutes, 0);
  const completedCount = monthRecords.filter((record) => record.goalCompleted).length;
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
        <span>목표 달성</span>
        <strong>${completedCount}회</strong>
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
      setFormDate(state.selectedDate);
      render();
      focusForm();
    });
  });
}

function renderCalendarDay(day) {
  const dateKey = formatDateKey(day.date);
  const records = getRecordsByDate(state.records, dateKey);
  const totalMinutes = records.reduce((sum, record) => sum + record.durationMinutes, 0);
  const completedMoves = getTotalCompletedCount(records);
  const moveVolumeLevel = getMoveVolumeLevel(completedMoves);
  const dayGoalsCompleted = isDayGoalsCompleted(records);
  const intensityLevel = getIntensityLevel(totalMinutes);
  const isSelected = dateKey === state.selectedDate;
  const isToday = dateKey === formatDateKey(new Date());
  const dayClasses = [
    "calendar-day",
    day.isCurrentMonth ? "" : "is-outside",
    isSelected ? "is-selected" : "",
    isToday ? "is-today" : "",
    moveVolumeLevel ? `move-level-${moveVolumeLevel}` : "",
    dayGoalsCompleted ? "is-goals-complete" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <button class="${dayClasses}" type="button" data-date="${dateKey}">
      ${dayGoalsCompleted ? '<span class="complete-badge"></span>' : ""}
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
  const completedCount = records.filter((record) => record.goalCompleted).length;
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
    <p class="stat-subtext">목표 달성 기록 ${completedCount}회 포함</p>
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

      state.editingRecordId = record.id;
      populateForm(record);
      renderFormState();
      focusForm();
    });
  });

  elements.recordList.querySelectorAll("[data-action='delete']").forEach((button) => {
    button.addEventListener("click", () => {
      deleteRecord(button.dataset.id);
    });
  });
}

function renderRecordCard(record) {
  const goalBlocks = getGoalBlocksFromRecord(record);
  const completedMoves = getTotalCompletedCount([record]);
  return `
    <article class="record-card">
      <div class="record-topline">
        <strong>${PRACTICE_TYPE_LABELS[record.practiceType]} 연습</strong>
        <span class="record-meta">${formatMinutes(record.durationMinutes)} · 동작 수행 ${completedMoves}회 · ${record.goalCompleted ? "목표 달성" : "진행 중"}</span>
      </div>

      <div class="tag-row">
        <span class="tag is-accent">${GENRE_LABELS[record.genre]}</span>
        ${record.location ? `<span class="tag location-tag">장소: ${escapeHtml(record.location)}</span>` : ""}
        <span class="tag">컨디션 ${record.conditionScore}/5</span>
        <span class="tag">만족도 ${record.satisfactionScore}/5</span>
      </div>

      <div class="detail-block">
        <h4>오늘의 목표</h4>
        ${renderRecordGoalBlocks(goalBlocks, record.goal)}
      </div>

      <div class="detail-block">
        <h4>실제 연습 내용</h4>
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

      <div class="record-actions">
        <span class="record-meta">업데이트 ${formatRelativeDateTime(record.updatedAt)}</span>
        <div class="month-actions">
          <button class="ghost-button" type="button" data-action="edit" data-id="${record.id}">수정</button>
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
  const totalMoveTargets = moveStats.reduce((sum, move) => sum + move.targetCount, 0);
  const totalMoveCompleted = moveStats.reduce((sum, move) => sum + move.completedCount, 0);

  elements.statsGrid.innerHTML = `
    ${renderDashboardInsights(monthRecords)}

    <article class="stat-card">
      <h3>이번 달 총 연습 횟수</h3>
      <div class="stat-value">${monthRecords.length}회</div>
      <p class="stat-subtext">기록이 있는 날짜 수 ${new Set(monthRecords.map((record) => record.practiceDate)).size}일</p>
    </article>

    <article class="stat-card">
      <h3>이번 달 총 연습 시간</h3>
      <div class="stat-value">${formatMinutes(totalMinutes)}</div>
      <p class="stat-subtext">1회 평균 ${monthRecords.length ? formatMinutes(Math.round(totalMinutes / monthRecords.length)) : "0분"}</p>
    </article>

    <article class="stat-card">
      <h3>장르별 연습 비중</h3>
      ${renderMiniBars(
        Object.entries(genreTotals).map(([genre, minutes]) => ({
          label: GENRE_LABELS[genre],
          value: minutes,
          display: formatMinutes(minutes),
        })),
      )}
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
      <h3>이번 달 목표 동작 수</h3>
      <div class="stat-value">${moveStats.length}개</div>
      <p class="stat-subtext">실제 수행 횟수 ${totalMoveCompleted}회 / 목표 ${totalMoveTargets}회</p>
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

function renderGoalBlockEditor() {
  if (!state.draftGoalBlocks.length) {
    elements.goalBlockList.innerHTML = `<div class="empty-state">아직 추가된 목표 블록이 없습니다.</div>`;
    elements.goal.value = "";
    elements.goalCompleted.checked = false;
    return;
  }

  elements.goalBlockList.innerHTML = state.draftGoalBlocks
    .map((block) => {
      const completion = calculateGoalBlockCompletion(block);
      return `
        <article class="goal-block-card">
          <div class="goal-block-main">
            <strong>${escapeHtml(block.moveName)}</strong>
            <span>${block.completedCount} / ${block.targetCount}회</span>
          </div>
          <div class="goal-block-meta">
            <span>${completion}%</span>
            <button class="goal-remove-button" type="button" data-action="remove-goal-block" data-id="${block.id}">삭제</button>
          </div>
          <div class="goal-progress">
            <div class="goal-progress-fill" style="width: ${Math.min(completion, 100)}%"></div>
          </div>
        </article>
      `;
    })
    .join("");

  elements.goal.value = summarizeGoalBlocks(state.draftGoalBlocks);
  elements.goalCompleted.checked = isGoalBlocksCompleted(state.draftGoalBlocks);

  elements.goalBlockList.querySelectorAll("[data-action='remove-goal-block']").forEach((button) => {
    button.addEventListener("click", () => {
      removeGoalBlock(button.dataset.id);
    });
  });
}

function addGoalBlock() {
  const moveName = elements.goalMoveName.value.trim();
  const targetCount = Math.max(Number(elements.goalTargetCount.value) || 1, 1);
  const completedCount = Math.max(Number(elements.goalCompletedCount.value) || 0, 0);

  if (!moveName) {
    elements.goalMoveName.focus();
    return;
  }

  state.draftGoalBlocks.push(
    normalizeGoalBlock({
      id: createScopedId("goal"),
      moveName,
      targetCount,
      completedCount,
    }),
  );

  clearFormError();
  elements.goalMoveName.value = "";
  elements.goalTargetCount.value = "10";
  elements.goalCompletedCount.value = "0";
  renderGoalBlockEditor();
  renderRecentMoveChips();
  elements.goalMoveName.focus();
}

function addGoalBlockFromRecent(moveName) {
  const recentMove = getRecentMoves().find((move) => move.moveName === moveName);
  state.draftGoalBlocks.push(
    normalizeGoalBlock({
      id: createScopedId("goal"),
      moveName,
      targetCount: recentMove?.targetCount || 10,
      completedCount: 0,
    }),
  );
  clearFormError();
  renderGoalBlockEditor();
}

function removeGoalBlock(goalBlockId) {
  state.draftGoalBlocks = state.draftGoalBlocks.filter((block) => block.id !== goalBlockId);
  renderGoalBlockEditor();
}

function getRecentMoves(limit = 8) {
  const moves = new Map();
  [...state.records]
    .sort((a, b) => b.practiceDate.localeCompare(a.practiceDate) || b.createdAt.localeCompare(a.createdAt))
    .forEach((record) => {
      getGoalBlocksFromRecord(record).forEach((block) => {
        if (!moves.has(block.moveName)) {
          moves.set(block.moveName, {
            moveName: block.moveName,
            targetCount: block.targetCount || 10,
          });
        }
      });
    });

  return [...moves.values()].slice(0, limit);
}

function renderRecentMoveChips() {
  const recentMoves = getRecentMoves();
  if (!recentMoves.length) {
    elements.recentMoveChips.innerHTML = `<span class="stat-subtext">최근 사용한 동작이 없습니다.</span>`;
    return;
  }

  elements.recentMoveChips.innerHTML = recentMoves
    .map(
      (move) =>
        `<button class="move-chip" type="button" data-move-name="${escapeHtml(move.moveName)}">${escapeHtml(move.moveName)}</button>`,
    )
    .join("");

  elements.recentMoveChips.querySelectorAll("[data-move-name]").forEach((button) => {
    button.addEventListener("click", () => {
      addGoalBlockFromRecent(button.dataset.moveName);
    });
  });
}

function getQuickTemplates() {
  return [
    {
      id: "solo-basic",
      label: "개인 기본기",
      practiceType: "solo",
      durationMinutes: 60,
      goalBlocks: [
        { moveName: "탑락", targetCount: 20, completedCount: 0 },
        { moveName: "풋워크", targetCount: 20, completedCount: 0 },
        { moveName: "프리즈", targetCount: 10, completedCount: 0 },
      ],
    },
    {
      id: "routine-run",
      label: "루틴 런스루",
      durationMinutes: 90,
      goalBlocks: [
        { moveName: "루틴 런스루", targetCount: 5, completedCount: 0 },
        { moveName: "문제 구간 반복", targetCount: 10, completedCount: 0 },
      ],
    },
    {
      id: "team-sync",
      label: "팀 합 맞추기",
      practiceType: "team",
      durationMinutes: 120,
      goalBlocks: [
        { moveName: "전체 런스루", targetCount: 3, completedCount: 0 },
        { moveName: "동선 정리", targetCount: 10, completedCount: 0 },
        { moveName: "카운트 맞추기", targetCount: 10, completedCount: 0 },
      ],
    },
    {
      id: "freestyle",
      label: "프리스타일",
      durationMinutes: 60,
      goalBlocks: [
        { moveName: "프리스타일 라운드", targetCount: 5, completedCount: 0 },
        { moveName: "음악 해석", targetCount: 5, completedCount: 0 },
      ],
    },
  ];
}

function renderQuickTemplates() {
  elements.quickTemplateChips.innerHTML = getQuickTemplates()
    .map((template) => `<button class="quick-template-chip" type="button" data-template-id="${template.id}">${template.label}</button>`)
    .join("");

  elements.quickTemplateChips.querySelectorAll("[data-template-id]").forEach((button) => {
    button.addEventListener("click", () => {
      applyQuickTemplate(button.dataset.templateId);
    });
  });
}

function applyQuickTemplate(templateId) {
  const template = getQuickTemplates().find((item) => item.id === templateId);
  if (!template) {
    return;
  }

  state.draftGoalBlocks = mergeGoalBlocks(state.draftGoalBlocks, template.goalBlocks);
  if (template.practiceType) {
    elements.practiceType.value = template.practiceType;
  }
  if (template.durationMinutes) {
    elements.durationMinutes.value = String(template.durationMinutes);
  }
  if (state.profile?.mainGenre) {
    elements.genre.value = state.profile.mainGenre;
  }
  clearFormError();
  renderGoalBlockEditor();
}

function mergeGoalBlocks(existingBlocks, incomingBlocks) {
  const blockMap = new Map();
  [...existingBlocks, ...incomingBlocks].forEach((block) => {
    const normalized = normalizeGoalBlock({ id: createScopedId("goal"), ...block });
    const current = blockMap.get(normalized.moveName);
    if (!current) {
      blockMap.set(normalized.moveName, normalized);
      return;
    }
    current.targetCount += normalized.targetCount;
    current.completedCount += normalized.completedCount;
  });
  return [...blockMap.values()];
}

function renderRecordGoalBlocks(goalBlocks, fallbackGoal) {
  if (!goalBlocks.length) {
    return `<p>${escapeHtml(fallbackGoal || "기록 없음")}</p>`;
  }

  return `
    <div class="goal-block-list is-compact">
      ${goalBlocks
        .map((block) => {
          const completion = calculateGoalBlockCompletion(block);
          const statusClass = completion >= 100 ? "is-complete" : completion < 50 ? "needs-work" : "";
          const statusLabel = completion >= 100 ? "완료" : completion < 50 ? "보완" : "진행";
          return `
            <div class="goal-block-card ${statusClass}">
              <div class="goal-block-main">
                <strong>${escapeHtml(block.moveName)}</strong>
                <span>${block.completedCount} / ${block.targetCount}회</span>
              </div>
              <div class="goal-block-meta">
                <span>${completion}%</span>
                <span class="goal-status-badge ${statusClass}">${statusLabel}</span>
              </div>
              <div class="goal-progress">
                <div class="goal-progress-fill" style="width: ${Math.min(completion, 100)}%"></div>
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
  const topMove = getTopMove(monthRecords);
  const goalSummary = getMonthlyGoalSummary(monthRecords);
  const conditionInsight = getConditionSatisfactionInsight(monthRecords);
  const balanceInsight = getPracticeBalanceInsight(monthRecords);

  return `
    <section class="dashboard-insight-grid">
      <article class="insight-card">
        <p class="section-kicker">Focus Move</p>
        <h3>이번 달 핵심 동작</h3>
        <div class="insight-value">${topMove ? escapeHtml(topMove.moveName) : "아직 없음"}</div>
        <p class="insight-comment">
          ${topMove ? `이번 달은 ${escapeHtml(topMove.moveName)} 중심으로 연습했어요. 총 ${topMove.completedCount}회 수행 / 목표 ${topMove.targetCount}회 / 달성률 ${topMove.completionRate}%` : "이번 달 기록을 추가하면 집중 동작이 표시됩니다."}
        </p>
      </article>

      <article class="insight-card">
        <p class="section-kicker">Goal Rate</p>
        <h3>목표 달성률</h3>
        <div class="insight-value">${goalSummary.completionRate}%</div>
        <p class="insight-comment">${goalSummary.completedCount} / ${goalSummary.targetCount}회 수행</p>
        <div class="goal-progress">
          <div class="goal-progress-fill" style="width: ${Math.min(goalSummary.completionRate, 100)}%"></div>
        </div>
      </article>

      <article class="insight-card">
        <p class="section-kicker">Body Check</p>
        <h3>컨디션-만족도</h3>
        <div class="insight-value">${conditionInsight.avgCondition.toFixed(1)} / ${conditionInsight.avgSatisfaction.toFixed(1)}</div>
        <p class="insight-comment">${conditionInsight.comment}</p>
      </article>

      <article class="insight-card">
        <p class="section-kicker">Balance</p>
        <h3>연습 균형</h3>
        <div class="insight-value">${balanceInsight.primaryLabel}</div>
        <p class="insight-comment">${balanceInsight.comment}</p>
      </article>
    </section>
  `;
}

function validateRecordForm() {
  if (!elements.practiceDate.value) {
    renderFormError("연습 날짜를 선택해주세요.");
    return false;
  }
  if (!state.draftGoalBlocks.length) {
    renderFormError("오늘의 목표를 최소 1개 이상 추가해주세요.");
    return false;
  }

  const durationMinutes = Number(elements.durationMinutes.value);
  const conditionScore = Number(elements.conditionScore.value);
  const satisfactionScore = Number(elements.satisfactionScore.value);

  if (Number.isNaN(durationMinutes) || durationMinutes < 0) {
    renderFormError("연습 시간은 0 이상이어야 합니다.");
    return false;
  }
  if (conditionScore < 1 || conditionScore > 5 || satisfactionScore < 1 || satisfactionScore > 5) {
    renderFormError("컨디션과 만족도 점수는 1~5 범위여야 합니다.");
    return false;
  }
  return true;
}

function renderFormError(message) {
  elements.formErrorMessage.textContent = message;
  elements.formErrorMessage.hidden = false;
}

function clearFormError() {
  elements.formErrorMessage.textContent = "";
  elements.formErrorMessage.hidden = true;
}

function renderFormState() {
  elements.formTitle.textContent = state.editingRecordId ? "기록 수정" : "새 연습 기록";
}

function upsertRecord() {
  if (!validateRecordForm()) {
    return;
  }
  clearFormError();
  const goalBlocks = state.draftGoalBlocks.map(normalizeGoalBlock);
  const existingRecord = elements.recordId.value ? getRecordById(elements.recordId.value) : null;
  const record = {
    id: elements.recordId.value || createId(),
    profileId: state.profile?.id || null,
    teamId: state.profile?.teamId || null,
    practiceDate: elements.practiceDate.value,
    practiceType: elements.practiceType.value,
    genre: elements.genre.value,
    durationMinutes: Number(elements.durationMinutes.value),
    goal: summarizeGoalBlocks(goalBlocks),
    goalBlocks,
    practiceNotes: elements.practiceNotes.value.trim(),
    reflection: elements.reflection.value.trim(),
    nextTask: elements.nextTask.value.trim(),
    conditionScore: Number(elements.conditionScore.value),
    satisfactionScore: Number(elements.satisfactionScore.value),
    location: elements.location.value.trim(),
    goalCompleted: isGoalBlocksCompleted(goalBlocks),
    createdAt: existingRecord ? existingRecord.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = state.records.findIndex((item) => item.id === record.id);
  if (existingIndex >= 0) {
    state.records.splice(existingIndex, 1, record);
  } else {
    state.records.push(record);
  }

  state.records.sort((a, b) => a.practiceDate.localeCompare(b.practiceDate) || a.createdAt.localeCompare(b.createdAt));
  state.selectedDate = record.practiceDate;
  state.currentMonth = getMonthStart(parseDateKey(record.practiceDate));
  state.editingRecordId = null;
  persistRecords();
  resetForm({ preserveDate: true });
  render();
}

function deleteRecord(recordId) {
  state.records = state.records.filter((record) => record.id !== recordId);
  if (state.editingRecordId === recordId) {
    state.editingRecordId = null;
    resetForm({ preserveDate: true });
  }

  persistRecords();
  render();
}

function populateForm(record) {
  elements.recordId.value = record.id;
  elements.practiceDate.value = record.practiceDate;
  elements.practiceType.value = record.practiceType;
  elements.genre.value = record.genre;
  elements.durationMinutes.value = String(record.durationMinutes);
  elements.goal.value = record.goal;
  state.draftGoalBlocks = getGoalBlocksFromRecord(record);
  elements.practiceNotes.value = record.practiceNotes;
  elements.reflection.value = record.reflection;
  elements.nextTask.value = record.nextTask;
  elements.location.value = record.location || "";
  elements.conditionScore.value = String(record.conditionScore);
  elements.satisfactionScore.value = String(record.satisfactionScore);
  elements.goalCompleted.checked = record.goalCompleted;
  elements.conditionValue.textContent = String(record.conditionScore);
  elements.satisfactionValue.textContent = String(record.satisfactionScore);
  clearFormError();
  renderGoalBlockEditor();
  renderRecentMoveChips();
}

function resetForm(options = {}) {
  const preserveDate = options.preserveDate ?? false;
  const dateValue = preserveDate ? state.selectedDate : formatDateKey(new Date());
  elements.recordForm.reset();
  elements.recordId.value = "";
  state.draftGoalBlocks = [];
  setFormDate(dateValue);
  elements.durationMinutes.value = "60";
  elements.goalTargetCount.value = "10";
  elements.goalCompletedCount.value = "0";
  elements.location.value = "";
  elements.conditionScore.value = "3";
  elements.satisfactionScore.value = "3";
  elements.conditionValue.textContent = "3";
  elements.satisfactionValue.textContent = "3";
  elements.goalCompleted.checked = false;
  clearFormError();
  renderGoalBlockEditor();
  renderRecentMoveChips();
  renderQuickTemplates();
  renderFormState();
}

function setFormDate(dateKey) {
  elements.practiceDate.value = dateKey;
  if (!elements.durationMinutes.value) {
    elements.durationMinutes.value = "60";
  }
}

function focusForm() {
  elements.goalMoveName.focus();
}

function loadProfile() {
  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
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
      goal: record.goal || summarizeGoalBlocks(goalBlocks),
      goalBlocks,
      practiceNotes: record.practiceNotes || "",
      reflection: record.reflection || "",
      nextTask: record.nextTask || "",
      conditionScore: Number(record.conditionScore) || 3,
      satisfactionScore: Number(record.satisfactionScore) || 3,
      location: record.location || "",
      goalCompleted:
        typeof record.goalCompleted === "boolean" ? record.goalCompleted : isGoalBlocksCompleted(goalBlocks),
      createdAt: record.createdAt || now,
      updatedAt: record.updatedAt || record.createdAt || now,
    };
  });
}

function normalizeGoalBlock(block) {
  return {
    id: block?.id || createScopedId("goal"),
    moveName: String(block?.moveName || "이름 없는 동작").trim() || "이름 없는 동작",
    targetCount: Math.max(Number(block?.targetCount) || 1, 1),
    completedCount: Math.max(Number(block?.completedCount) || 0, 0),
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
    .map((block) => `${block.moveName} ${block.completedCount}/${block.targetCount}회`)
    .join(", ");
}

function isGoalBlocksCompleted(goalBlocks) {
  return Boolean(goalBlocks.length) && goalBlocks.every((block) => block.completedCount >= block.targetCount);
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
      sum + getGoalBlocksFromRecord(record).reduce((blockSum, block) => blockSum + block.completedCount, 0),
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
  const moveStats = aggregateMoveStats(monthRecords);
  const targetCount = moveStats.reduce((sum, move) => sum + move.targetCount, 0);
  const completedCount = moveStats.reduce((sum, move) => sum + move.completedCount, 0);
  return {
    targetCount,
    completedCount,
    completionRate: targetCount ? Math.round((completedCount / targetCount) * 100) : 0,
  };
}

function getTopMove(monthRecords) {
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

function getMoveVolumeLevel(completedMoves) {
  if (completedMoves >= 51) {
    return 3;
  }
  if (completedMoves >= 21) {
    return 2;
  }
  if (completedMoves >= 1) {
    return 1;
  }
  return 0;
}

function isDayGoalsCompleted(records) {
  return Boolean(records.length) && records.every((record) => isGoalBlocksCompleted(getGoalBlocksFromRecord(record)));
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

function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
