import { Type } from "typescript"

class Box<Type>{
  content:Type

  constructor(value:Type){
    this.content = value
  }

  static defaultVal = 100
}

