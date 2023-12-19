import { vi } from 'vitest'

import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggragatedCreated(aggregate))

    return aggregate
  }
}

class CustomAggragatedCreated implements DomainEvent {
  public ocurredAt: Date
  private readonly aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId() {
    return new UniqueEntityID(this.aggregate.id)
  }
}

describe('DomainEvents', () => {
  let aggregate: CustomAggregate

  beforeEach(() => {
    aggregate = CustomAggregate.create()
  })

  it('should add aggregate to markedAggregates', () => {
    expect(aggregate.domainEvents.length).toBe(1)
    expect(aggregate.domainEvents[0]).toBeInstanceOf(CustomAggragatedCreated)
    expect(aggregate.domainEvents[0].getAggregateId().id).toBe(aggregate.id)
  })

  it('should dispatch aggregate events', () => {
    const callBackSpy = vi.fn()

    DomainEvents.registerSubscriber(callBackSpy, CustomAggragatedCreated.name)

    DomainEvents.dispatchPublisherEventsForAggregate(
      new UniqueEntityID(aggregate.id),
    )

    expect(callBackSpy).toBeCalledTimes(1)
    expect(aggregate.domainEvents.length).toBe(0)
  })
})
