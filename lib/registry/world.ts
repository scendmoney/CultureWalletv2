import { type SignalEvent } from "@/lib/stores/signalsStore"

/**
 * World ID Registry
 * 
 * Minimal scoping mechanism to allow CultureWallet to coexist with other applications
 * on the same TrustMesh infrastructure.
 */

// 1. Source Canonical WORLD_ID
export const WORLD_ID = process.env.NEXT_PUBLIC_WORLD_ID || "culturewallet";

export interface WorldScoped {
  worldId?: string;
  metadata?: {
    worldId?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Attaches the current WORLD_ID to an event payload
 * Places worldId at root level for visibility and inside metadata for persistence conventions
 */
export function withWorld<T extends object>(payload: T): T & { worldId: string } {
  const worldId = WORLD_ID;
  
  // Handle existing metadata if present
  const existingMetadata = (payload as any).metadata || {};
  
  return {
    ...payload,
    worldId,
    metadata: {
      ...existingMetadata,
      worldId
    }
  };
}

export interface WorldFilterOpts {
  includeLegacy?: boolean; // If true, treat events without worldId as matching
  targetWorldId?: string;  // Override target world (default: current app world)
}

/**
 * Checks if an event belongs to the current world scope
 * Checks both root-level worldId and metadata.worldId
 */
export function isInWorld(event: WorldScoped, opts: WorldFilterOpts = {}): boolean {
  const { 
    includeLegacy = true, 
    targetWorldId = WORLD_ID 
  } = opts;

  // Extract worldId from root or metadata
  const eventWorldId = event.worldId || event.metadata?.worldId;

  // Legacy event (no worldId found)
  if (!eventWorldId) {
    return includeLegacy;
  }

  // Explicit worldId match (case-sensitive default, could be relaxed if needed)
  return eventWorldId === targetWorldId;
}

/**
 * Filters a list of events to only those in the current world scope
 */
export function filterWorld<T extends WorldScoped>(events: T[], opts: WorldFilterOpts = {}): T[] {
  return events.filter(e => isInWorld(e, opts));
}
