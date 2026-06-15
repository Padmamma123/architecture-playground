import type { StoryScene, StoryLine, StoryCharacter } from '../types';

/** Build ordered character speech lines from scene data */
export function buildSceneLines(scene: StoryScene, characters: StoryCharacter[]): StoryLine[] {
  if (scene.lines?.length) return scene.lines;

  if (scene.dialogue?.length) {
    return scene.dialogue.map((d) => ({ characterId: d.characterId, text: d.text }));
  }

  if (scene.narrator) {
    return [{ characterId: characters[0]?.id ?? 'unknown', text: scene.narrator }];
  }

  return [];
}

export function getInsightSpeaker(scene: StoryScene, characters: StoryCharacter[]): StoryCharacter | undefined {
  if (scene.insightCharacterId) {
    return characters.find((c) => c.id === scene.insightCharacterId);
  }
  return characters[characters.length - 1];
}
