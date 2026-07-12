import { createContext, useContext, useEffect, useRef, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { AppStore } from './logic.core.js'

/** Everything the screens consume: the ~150 bindings renderVals() computes. */
export type Vals = ReturnType<AppStore['renderVals']>

const Ctx = createContext<Vals | null>(null)

/** Singleton handle for non-React consumers (native glue). Set by AppProvider. */
export const appStoreRef: { current: AppStore | null } = { current: null }

export function AppProvider({
  appProps,
  children,
}: {
  appProps?: { journalEmpty?: boolean; plusMember?: boolean }
  children: ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = new AppStore(appProps)
    appStoreRef.current = storeRef.current
  }
  const store = storeRef.current

  useSyncExternalStore(store.subscribe, store.getSnapshot)
  useEffect(() => {
    store.mount()
    return () => store.unmount()
  }, [store])

  return <Ctx.Provider value={store.renderVals()}>{children}</Ctx.Provider>
}

export function useApp(): Vals {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside <AppProvider>')
  return v
}
