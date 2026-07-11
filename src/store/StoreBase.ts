/**
 * Minimal stand-in for the dc-runtime's DCLogic base class.
 * Gives the ported logic class (logic.core.js) the same contract it had
 * under the runtime: this.props, this.state, this.setState (object patch
 * or updater function, shallow-merged), plus mount/unmount lifecycle
 * forwarding — while exposing a subscribe/getSnapshot pair for
 * useSyncExternalStore on the React side.
 */
export type Listener = () => void

export class StoreBase {
  props: Record<string, any>
  state: any = {}
  private listeners = new Set<Listener>()
  private mounted = false

  constructor(props?: Record<string, any>) {
    this.props = props || {}
  }

  setState(patch: any): void {
    const p = typeof patch === 'function' ? patch(this.state) : patch
    if (!p) return
    this.state = Object.assign({}, this.state, p)
    this.listeners.forEach((l) => l())
  }

  subscribe = (l: Listener): (() => void) => {
    this.listeners.add(l)
    return () => {
      this.listeners.delete(l)
    }
  }

  getSnapshot = (): any => this.state

  mount(): void {
    if (this.mounted) return
    this.mounted = true
    ;(this as any).componentDidMount?.()
  }

  unmount(): void {
    if (!this.mounted) return
    this.mounted = false
    ;(this as any).componentWillUnmount?.()
  }
}
