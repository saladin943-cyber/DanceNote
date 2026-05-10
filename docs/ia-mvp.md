# DanceNote MVP Plan

## 1. IA

### Primary Navigation
- Calendar
- Stats
- Write Record

### Screen Relationships
1. Calendar is the default home screen.
2. Selecting a date opens the record panel for that date.
3. If no record exists, the user sees a quick-create form.
4. If records exist, the user sees summary cards with edit and delete actions.
5. Stats summarizes the currently stored records for the active month and recent 7 days.

### Information Layers
- App shell: header, month controls, primary tabs
- Calendar layer: month grid, daily state, selected date
- Record layer: daily summary, record list, create/edit form
- Insight layer: monthly metrics and weekly trend

## 2. Main Screens

### Calendar Home
- Monthly calendar
- Practice state by day
- Selected date summary
- Quick CTA to add a record

### Record Form
- Date
- Practice type
- Genre
- Duration
- Goal
- Practice notes
- Reflection
- Next task
- Condition score
- Satisfaction score
- Goal completion

### Record Detail
- Daily summary
- Record cards
- Edit
- Delete

### Stats
- Monthly practice count
- Monthly practice hours
- Genre ratio
- Solo/team ratio
- Recent 7 day trend

## 3. Data Model

### PracticeRecord
```ts
type PracticeType = "solo" | "team";
type PracticeGenre =
  | "breaking"
  | "hiphop"
  | "choreo"
  | "locking"
  | "popping"
  | "other";

interface PracticeRecord {
  id: string;
  practiceDate: string; // YYYY-MM-DD
  practiceType: PracticeType;
  genre: PracticeGenre;
  durationMinutes: number;
  goal: string;
  practiceNotes: string;
  reflection: string;
  nextTask: string;
  conditionScore: 1 | 2 | 3 | 4 | 5;
  satisfactionScore: 1 | 2 | 3 | 4 | 5;
  goalCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Storage Shape
```ts
interface PracticeStore {
  records: PracticeRecord[];
  version: 1;
}
```

### Migration Direction
- `practiceDate` and scalar fields map cleanly to Firebase, Supabase, SQLite.
- `id`, `createdAt`, `updatedAt` support sync and conflict handling later.
- `practiceType` and `genre` are enum-like values, so validation can stay consistent across clients.

## 4. MVP Scope

### Included
- Monthly calendar
- Date-based record visibility
- Create, update, delete practice records
- Visual intensity/completion markers
- Monthly and 7 day summary stats
- Responsive single-page flow
- Local storage persistence

### Excluded
- Login
- Team sharing
- Media upload
- Notifications
- Routine recommendation
- Cloud sync

## 5. Responsive Wireframe

### Mobile
1. Header with month controls and summary chip
2. Calendar grid
3. Selected date panel
4. Stats cards
5. Record list or write form

### Desktop
1. Left column: hero summary, calendar, stats
2. Right column: selected date details, record cards, form
3. Sticky right panel for fast editing while browsing calendar

## 6. Target React Code Structure

```text
src/
  app/
    layout.tsx
    page.tsx
  components/
    calendar/
      calendar-grid.tsx
      calendar-day.tsx
      month-switcher.tsx
    records/
      record-form.tsx
      record-list.tsx
      record-card.tsx
      daily-summary.tsx
    stats/
      stats-panel.tsx
      weekly-trend.tsx
      genre-breakdown.tsx
  features/
    practice/
      practice.types.ts
      practice.constants.ts
      practice.storage.ts
      practice.selectors.ts
      practice.mock.ts
      use-practice-store.ts
  lib/
    date.ts
    format.ts
    score.ts
  styles/
    globals.css
```

### State Strategy
- Start with local component state plus a thin storage module.
- Upgrade path: Zustand or TanStack Query plus backend adapter.

## 7. Prototype Direction

- Implemented as a clean static prototype in the current repository because no React build setup exists yet.
- UI and data flow follow the proposed React structure, so migration is mechanical.
- Local storage is already abstracted around record operations and selectors.
