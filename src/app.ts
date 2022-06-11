type ToArrary<T> = T extends any ? T[] : never

type StrArray = ToArrary<string>
const arr:StrArray = ['222']

type NumArray = ToArrary<number>
const numArr:NumArray = [100]