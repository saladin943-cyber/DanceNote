// Local-first storage keeps the MVP simple while preserving an easy backend migration path.
const STORAGE_KEY = "dance-note-records-v1";
const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const GENRE_LABELS = {
  breaking: "브레이킹",
  hiphop: "힙합",
  choreo: "코레오",
  locking: "락킹",
  popping: "팝핀",
  other: "기타",
};
const PRACTICE_TYPE_LABELS = {
  solo: "개인",
  team: "팀",
};

const mockRecords = [
  {
    id: "rec-1",
    practiceDate: "2026-04-03",
    practiceType: "solo",
    genre: "breaking",
    durationMinutes: 90,
    goal: "탑락과 풋워크 연결을 끊기지 않게 이어가기",
    practiceNotes: "워밍업 후 풋워크 반복, 마지막 20분은 음악 맞춰 루틴 정리.",
    reflection: "초반에는 몸이 무거웠지만 후반 집중은 좋았다.",
    nextTask: "내일은 프리즈 진입 타이밍 보완.",
    conditionScore: 3,
    satisfactionScore: 4,
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
    practiceNotes: "팀원들과 카운트 단위로 동선 수정. 후렴 디테일 반복.",
    reflection: "팀 합은 좋아졌지만 표정과 마무리 디테일이 더 필요하다.",
    nextTask: "동선 전환 구간 영상 촬영 후 확인.",
    conditionScore: 4,
    satisfactionScore: 4,
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
    practiceNotes: "거울 보면서 상체 고립 중심 연습.",
    reflection: "컨디션이 낮아서 강도는 낮췄지만 감각 회복에는 도움이 됐다.",
    nextTask: "템포 올려서 리듬 분리 연습.",
    conditionScore: 2,
    satisfactionScore: 3,
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
    practiceNotes: "전체 런스루 2회, 문제 구간 따로 반복.",
    reflection: "체력 소모가 커서 후반 에너지 유지가 숙제다.",
    nextTask: "호흡 분배와 전환 동작 정리.",
    conditionScore: 3,
    satisfactionScore: 5,
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
    practiceNotes: "베이직 반복 후 짧은 프리스타일 기록.",
    reflection: "기본기 연습이 짧게라도 쌓이는 느낌이 좋았다.",
    nextTask: "팔 라인 정돈과 음악 해석 확장.",
    conditionScore: 4,
    satisfactionScore: 4,
    goalCompleted: false,
    createdAt: "2026-04-19T13:20:00.000Z",
    updatedAt: "2026-04-19T13:20:00.000Z",
  },
];

const state = {
  records: loadRecords(),
  currentMonth: getMonthStart(new Date()),
  selectedDate: formatDateKey(new Date()),
  editingRecordId: null,
};

const elements = {
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
  practiceNotes: document.getElementById("practiceNotes"),
  reflection: document.getElementById("reflection"),
  nextTask: document.getElementById("nextTask"),
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
}

function render() {
  const monthRecords = getMonthRecords(state.records, state.currentMonth);
  const selectedRecords = getRecordsByDate(state.records, state.selectedDate);

  elements.monthLabel.textContent = formatMonthLabel(state.currentMonth);
  elements.selectedDateLabel.textContent = formatSelectedDate(state.selectedDate);

  renderHero(monthRecords);
  renderCalendar();
  renderDailySummary(selectedRecords);
  renderRecordList(selectedRecords);
  renderStats(monthRecords);
  renderFormState();
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
  const intensityLevel = getIntensityLevel(totalMinutes);
  const isSelected = dateKey === state.selectedDate;
  const isToday = dateKey === formatDateKey(new Date());
  const dayClasses = [
    "calendar-day",
    day.isCurrentMonth ? "" : "is-outside",
    isSelected ? "is-selected" : "",
    isToday ? "is-today" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <button class="${dayClasses}" type="button" data-date="${dateKey}">
      ${records.some((record) => record.goalCompleted) ? '<span class="complete-badge"></span>' : ""}
      <span class="calendar-day-number">${day.date.getDate()}</span>
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
  return `
    <article class="record-card">
      <div class="record-topline">
        <strong>${PRACTICE_TYPE_LABELS[record.practiceType]} 연습</strong>
        <span class="record-meta">${formatMinutes(record.durationMinutes)} · ${record.goalCompleted ? "목표 달성" : "진행 중"}</span>
      </div>

      <div class="tag-row">
        <span class="tag is-accent">${GENRE_LABELS[record.genre]}</span>
        <span class="tag">컨디션 ${record.conditionScore}/5</span>
        <span class="tag">만족도 ${record.satisfactionScore}/5</span>
      </div>

      <div class="detail-block">
        <h4>오늘의 목표</h4>
        <p>${escapeHtml(record.goal || "기록 없음")}</p>
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

  elements.statsGrid.innerHTML = `
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

function renderFormState() {
  elements.formTitle.textContent = state.editingRecordId ? "기록 수정" : "새 연습 기록";
}

function upsertRecord() {
  const record = {
    id: elements.recordId.value || createId(),
    practiceDate: elements.practiceDate.value,
    practiceType: elements.practiceType.value,
    genre: elements.genre.value,
    durationMinutes: Number(elements.durationMinutes.value),
    goal: elements.goal.value.trim(),
    practiceNotes: elements.practiceNotes.value.trim(),
    reflection: elements.reflection.value.trim(),
    nextTask: elements.nextTask.value.trim(),
    conditionScore: Number(elements.conditionScore.value),
    satisfactionScore: Number(elements.satisfactionScore.value),
    goalCompleted: elements.goalCompleted.checked,
    createdAt: elements.recordId.value
      ? getRecordById(elements.recordId.value).createdAt
      : new Date().toISOString(),
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
  elements.practiceNotes.value = record.practiceNotes;
  elements.reflection.value = record.reflection;
  elements.nextTask.value = record.nextTask;
  elements.conditionScore.value = String(record.conditionScore);
  elements.satisfactionScore.value = String(record.satisfactionScore);
  elements.goalCompleted.checked = record.goalCompleted;
  elements.conditionValue.textContent = String(record.conditionScore);
  elements.satisfactionValue.textContent = String(record.satisfactionScore);
}

function resetForm(options = {}) {
  const preserveDate = options.preserveDate ?? false;
  const dateValue = preserveDate ? state.selectedDate : formatDateKey(new Date());
  elements.recordForm.reset();
  elements.recordId.value = "";
  setFormDate(dateValue);
  elements.durationMinutes.value = "60";
  elements.conditionScore.value = "3";
  elements.satisfactionScore.value = "3";
  elements.conditionValue.textContent = "3";
  elements.satisfactionValue.textContent = "3";
  elements.goalCompleted.checked = false;
  renderFormState();
}

function setFormDate(dateKey) {
  elements.practiceDate.value = dateKey;
  if (!elements.durationMinutes.value) {
    elements.durationMinutes.value = "60";
  }
}

function focusForm() {
  elements.goal.focus();
}

function loadRecords() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRecords));
    return [...mockRecords];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...mockRecords];
  } catch (error) {
    console.error("Failed to parse records from storage.", error);
    return [...mockRecords];
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
