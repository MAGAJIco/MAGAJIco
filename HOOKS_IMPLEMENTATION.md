# Custom Hooks Implementation Guide

This document explains the custom hooks in the MagajiCo app and how they're being used.

## 📍 Custom Hooks Location

All custom hooks are in: `src/app/hook/`

## 🔧 Available Custom Hooks

### 1. useSmartRetry - Automatic Retry with Exponential Backoff

**Location:** `src/app/hook/useSmartRetry.ts`

**Purpose:** Automatically retries failed operations (like API calls) with smart timing

**How it works:**
- First attempt: Immediate
- Retry 1: Waits ~1 second
- Retry 2: Waits ~2 seconds  
- Retry 3: Waits ~4 seconds
- Adds random jitter to prevent retry storms
- Won't retry authentication errors (401/403)

**Usage Example:**
```typescript
import { useSmartRetry } from "../../hook/useSmartRetry";

// 1. Initialize the hook
const { executeWithRetry, isRetrying, retryCount } = useSmartRetry({
  maxRetries: 3,           // Try up to 3 times
  baseDelay: 1000,         // Start with 1 second delay
  onRetry: (attempt, error) => {
    console.log(`Retry attempt ${attempt}:`, error.message);
  }
});

// 2. Wrap your async function
const fetchData = async () => {
  try {
    const result = await executeWithRetry(async () => {
      // Your API call or async operation here
      const response = await fetch('/api/data');
      return response.json();
    });
    
    // Use the result
    console.log(result);
  } catch (err) {
    console.error('Failed after all retries:', err);
  }
};

// 3. Show retry status in UI
{isRetrying && (
  <div>Retrying... (Attempt {retryCount}/3)</div>
)}
```

### 2. useApi - Simple API Data Fetching

**Location:** `src/app/hook/useApi.ts`

**Purpose:** Fetch data from APIs with automatic state management

**How it works:**
- Manages loading, data, and error states automatically
- Can auto-refresh at intervals
- Supports GET, POST, PUT, DELETE methods

**Usage Example:**
```typescript
import { useApi } from "../../hook/useApi";

// 1. Initialize the hook
const { data, loading, error, refetch } = useApi('/predictions/soccer', {
  method: 'GET',
  refetchInterval: 30000,  // Auto-refresh every 30 seconds
  enabled: true            // Only fetch when enabled
});

// 2. Use the data in your component
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return (
  <div>
    <button onClick={refetch}>Refresh</button>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);
```

## ✅ Implementation in Predictions Page

### Before (Manual fetch with no retry):
```typescript
const fetchPredictions = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/predictions');
    const data = await response.json();
    setPredictions(data);
  } catch (err) {
    setError(err);
    // Failed permanently - no retry!
  } finally {
    setLoading(false);
  }
};
```

### After (With useSmartRetry):
```typescript
const { executeWithRetry, isRetrying, retryCount } = useSmartRetry({
  maxRetries: 3,
  baseDelay: 1000
});

const fetchPredictions = async () => {
  setLoading(true);
  try {
    // Automatically retries on failure!
    const result = await executeWithRetry(async () => {
      const response = await fetch('/api/predictions');
      return response.json();
    });
    setPredictions(result);
  } catch (err) {
    setError(err); // Only fails after 3 retries
  } finally {
    setLoading(false);
  }
};
```

## 🎨 Visual Indicators

### Retry Status Banner
When retrying, a notification appears:
```typescript
{isRetrying && (
  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
    <div className="flex items-center gap-3">
      <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
      <div>
        <p className="text-amber-400 font-semibold">Retrying connection...</p>
        <p className="text-sm text-gray-400">Attempt {retryCount} of 3</p>
      </div>
    </div>
  </div>
)}
```

### Retry Indicator on Refresh Button
```typescript
<button title={isRetrying ? `Retrying... (${retryCount}/3)` : "Refresh"}>
  <RefreshCw className={loading ? "animate-spin" : ""} />
  {isRetrying && (
    <span className="absolute -top-1 -right-1">
      <span className="animate-ping bg-amber-400"></span>
      <span className="bg-amber-500"></span>
    </span>
  )}
</button>
```

## 💡 Benefits

### Without Custom Hooks:
- ❌ Write same fetch logic everywhere
- ❌ No automatic retry on failure
- ❌ Manual state management (loading, error, data)
- ❌ Inconsistent error handling
- ❌ More code duplication

### With Custom Hooks:
- ✅ Reusable fetch logic
- ✅ Automatic retry with exponential backoff
- ✅ Automatic state management
- ✅ Consistent error handling
- ✅ Less code, easier maintenance

## 🔍 Where Hooks Are Used

| Hook | File | Purpose |
|------|------|---------|
| `useSmartRetry` | `predictions/page.tsx` | Retry failed API calls for predictions |
| `useState` | Multiple files | Store component state |
| `useEffect` | Multiple files | Run code when things change |
| `useMemo` | `MagajicoAppLauncher.tsx` | Cache filtered/sorted data |

## 📚 Next Steps

You can create more custom hooks for:
- `useLocalStorage` - Persist data in browser
- `useDebounce` - Delay search input
- `useWebSocket` - Real-time live match updates
- `usePagination` - Handle paginated data
- `useInfiniteScroll` - Load more on scroll

## 🎯 Key Takeaways

1. **Hooks = Reusable Logic** - Write once, use everywhere
2. **Custom Hooks = Your Own Tools** - Build helpers for common tasks
3. **Smart Retry = Better UX** - Don't fail on temporary network issues
4. **State Management = Less Code** - Hooks handle complexity for you
