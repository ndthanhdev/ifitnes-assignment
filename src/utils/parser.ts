import peg from 'pegjs'
import { IEntity, ITickerEntity, ICombination } from '../interfaces/Entity'

const grammar = `
Expression
  = Entity*

Entity
  = Combination
    / TickerEntity

Combination
  = left:TickerEntity right:("+" Entity)+ {
    return right.reduce((acc,entity)=>{
        if(entity[1].type === 'Combination') acc.queries.push(...entity[1].queries)
        else acc.queries.push(entity[1])
      return acc;
      }, {
          type: 'Combination',
          queries:[left]
        })
  }

TickerEntity
  = tickerSymbol:TickerSymbol operator:Operator? base:(Base)? {
    return {
      type: 'TickerEntity',
        tickerSymbol,
        operator:operator||">",
        base,
    }
  }
  
Operator
  = _ op:(">"/"<") _ {
      return op
    }

Base
  = _ [0-9]+("."[0-9]*)? _ { return parseFloat(text(), 10); }

TickerSymbol "ticker symbol"
  = _ [A-Z|0-9]+ _ {return text().trim()}

_ "whitespace"
  = [ \\t\\n\\r]*
`

const parser = peg.generate(grammar)

class InvalidType extends Error {
  constructor() {
    super('Input has invalid type')
  }
}

function createEntity(object: any): IEntity {
  if (object.type === 'TickerEntity') return object as ITickerEntity
  else if (object.type === 'Combination') return object as ICombination
  throw new InvalidType()
}

export const parse = (input: string): IEntity[] | string => {
  try {
    const output = parser.parse(input) as Array<any>
    return output.map(createEntity)
  } catch (error) {
    return error.message
  }
}
