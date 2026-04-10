export function toSlotId(boxId: string, slotIndex: number): string {
  return `${boxId}:${slotIndex}`
}

export function fromSlotId(id: string): { boxId: string; slotIndex: number } {
  const lastColon = id.lastIndexOf(':')
  return {
    boxId: id.slice(0, lastColon),
    slotIndex: Number(id.slice(lastColon + 1)),
  }
}
