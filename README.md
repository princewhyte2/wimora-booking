# Wimora — mini braider booking app

A small booking flow built with **Expo SDK 58, React Native 0.88, Expo Router and TypeScript (strict)**.

Browse braiders → view a braider's services and open times → pick a service and time, enter your details → get a confirmation with a booking reference.

## Try it on Android (no setup)

An installable preview build (APK) is available. No Expo account or app store needed:

1. On an Android phone, open **[the build page](https://expo.dev/accounts/princewhyte2/projects/wimora-booking/builds/7132921d-f4b2-4886-8e19-8c5e4ce3dd2f)**, or scan its QR code from a desktop browser.
2. Tap **Install** to download the APK and open it. Android will ask you to allow installs from your browser the first time.

It was built with `eas build -p android --profile preview` (see `eas.json`). The `preview` profile produces a standalone APK for internal distribution.

## Running it

Requires Node 20+.

```bash
npm install
npm start          # then press i (iOS simulator), a (Android emulator), or scan the QR code with Expo Go
npm run web        # or open straight in the browser
```

Quality checks:

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # expo lint (eslint-config-expo)
npm test           # jest-expo unit tests
npx expo-doctor    # dependency / config health
```

### Simulating failures

The mock API adds ~600 ms of latency so loading states are real. To exercise the error states, start the app with a random failure rate (0–1):

```bash
EXPO_PUBLIC_MOCK_FAILURE_RATE=0.5 npm start   # half of all requests fail
EXPO_PUBLIC_MOCK_FAILURE_RATE=1 npm start     # every request fails
```

## Project structure

```
src/
  app/                    Expo Router routes only. Each file reads URL params and renders a screen.
    _layout.tsx           Providers (React Query, navigation theme) and the Stack.
    index.tsx             /                          → braider list
    braiders/[id]/index   /braiders/:id              → braider detail
    braiders/[id]/book    /braiders/:id/book         → booking form (?service=&slot= pre-select)
    bookings/[bookingId]  /bookings/:bookingId       → confirmation
    +not-found.tsx
  screens/                One folder per screen; private sub-components live beside it.
  components/             Shared UI kit: Text, Button, Card, TextField, ChoiceChip, StateView, …
  api/                    Data layer: mock "server", fetchers, React Query hooks and keys.
  data/braiders.ts        The provided mock data (seed for the mock API).
  theme/                  Design tokens: light/dark palettes, spacing, radius, typography.
  hooks/use-theme.ts      Resolves the current color scheme to tokens.
  types/domain.ts         Domain types: Braider, Service, BookingRequest, Booking.
  utils/                  Pure helpers (search, formatting, form validation) + colocated tests.
```

## Main decisions

**Screens never touch the mock data directly.** `src/data` is only read by `src/api/mock-db.ts`, which plays the role of a backend. Screens go through async fetchers (`fetchBraiders`, `fetchBraider`, `createBooking`, `fetchBooking`) that simulate latency and failures and honour `AbortSignal`. Swapping in a real API means rewriting `src/api/*` only; no screen changes.

**TanStack Query for server state.** It covers loading, error, retry, cancellation, caching and invalidation, which would otherwise be hand-rolled per screen. A few details worth pointing out:
- Query keys live in one `queryKeys` object, so invalidation can't drift from the queries.
- Retries happen only for `NETWORK` errors. A `NOT_FOUND` won't fix itself, so it isn't retried.
- The detail query uses the list's cached braider as `placeholderData`, so tapping a row renders instantly while fresh data loads.
- After a booking, the mutation primes the confirmation's cache entry and invalidates the braider queries. The booked slot then disappears from that braider's availability.
- Screens render whenever data exists and only show a loading or error state when there is nothing to show. A failed background refetch never replaces good data with an error screen.

**The server validates too.** The form validates on the client for fast feedback, but `createBooking` re-checks that the service and slot exist and that the slot isn't already taken. A double booking returns a `CONFLICT` error, which the form shows inline. The selection is cleared once refreshed availability arrives.

**Bookings snapshot what was booked.** A `Booking` stores the braider name, the service price and duration, and the slot at the moment of booking, like a receipt. The confirmation stays accurate even if the catalogue changes later.

**URLs carry navigation state, not data.** Routes pass only IDs plus optional `?service=`/`?slot=` pre-selections. Tapping a service or a time slot on the detail screen opens the form with it already selected. The confirmation route takes a booking ID and loads the booking through the query layer. Deep links and web refreshes therefore behave correctly, and the not-found case shows a useful message.

**Navigation choices.**
- Typed routes are on, so every `href` is checked against the real route tree.
- `unstable_settings.anchor = 'index'` keeps the list under any deep-linked screen, so there is always a way back.
- Submitting replaces the booking route with the confirmation, which also hides its back button and swipe gesture. Going "back" can't resubmit or show a stale form.

**Search** is a cross-platform field in the page rather than the iOS-only native header search bar, so it behaves the same on iOS, Android and web. It ignores case and accents, and every word must match, so "box fatima" narrows the results. `useDeferredValue` keeps typing smooth if the list grows.

**States everywhere they make sense:**
- Loading spinners.
- Error views with retry, and "Browse braiders" instead of retry for not-found.
- Empty search results with a "Clear search" action.
- A fully-booked braider.
- Inline field errors, shown after blur or a submit attempt rather than while typing.
- A submit loading state and a submission-error banner.

**Design system.** One set of tokens (`src/theme`) with matching light and dark palettes, consumed through `useTheme()` and a small component kit. No hardcoded colors live in screens. Content is capped at 640 px so tablets and desktop web stay readable.

**Accessibility.**
- Rows and options have descriptive labels ("Adaeze Okafor, Knotless braids, rated 4.9, from $120").
- Service and time pickers use `radiogroup`/`radio` roles with `checked` state.
- Errors are announced through live regions.
- Touch targets are at least 44 pt.
- Form fields use the right keyboard, autofill and content types (`name`, `tel`).

**Web specifics.** `expo-router` renders `Link` as a real `<a href>` on web, so rows support middle-click and open-in-new-tab. `Link asChild` drops a `Pressable`'s function-style on web, so `LinkPressable` puts the styling on an inner view instead. Web output is `single` (SPA), since there are no API routes or SEO needs.

**React Compiler is enabled** (Expo's default), so components contain no manual `useMemo`/`useCallback`.

## Testing

`jest-expo` unit tests cover the logic most likely to break:
- Search matching: case, accents, multi-word queries.
- Formatting: durations, prices, initials.
- Booking form validation: names, phone formats.
- The booking API: snapshotting, slot reservation, double-booking conflict, unknown service or braider.

The full flow was also checked end to end in the browser, in light and dark mode, at phone and desktop widths, with forced API failures.

## What I'd do next

- Use real dates (ISO timestamps plus time zone) instead of display strings like "Mon 9:00 AM" for slots.
- Persist bookings, either with a real backend or locally with `expo-sqlite`, so a confirmation survives a reload.
- Use phone input with country-code formatting (e.g. libphonenumber) and send an SMS confirmation from the backend.
- Add component tests with React Native Testing Library for the booking form, plus an E2E smoke test (Maestro).
- Add braider photos, reviews and filtering by location or price.
- Adopt `@expo/ui` native controls for the pickers on iOS and Android.
