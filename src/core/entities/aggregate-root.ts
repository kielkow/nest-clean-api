import { DomainEvent } from '../events/domain-event'
import { Entity } from './entity'
import { DomainEvents } from '../events/domain-events'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents() {
    return this._domainEvents
  }

  public clearEvents() {
    this._domainEvents.splice(0, this._domainEvents.length)
  }

  protected addDomainEvent(domainEvent: DomainEvent) {
    this._domainEvents.push(domainEvent)
    DomainEvents.registerPublisher(this)
  }
}
