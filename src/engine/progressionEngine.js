import { milestones } from "../data/milestones.js";

export function getMilestone(id) {
  return milestones.find((milestone) => milestone.id === id) ?? null;
}

export function getAllMilestones() {
  return milestones;
}

export function getCompletedMilestones(completedIds = []) {
  return milestones.filter((milestone) => completedIds.includes(milestone.id));
}

export function getIncompleteMilestones(completedIds = []) {
  return milestones.filter((milestone) => !completedIds.includes(milestone.id));
}

export function getBlockedMilestones(completedIds = []) {
  return getIncompleteMilestones(completedIds).filter((milestone) =>
    milestone.requires.some(
      (requirementId) => !completedIds.includes(requirementId)
    )
  );
}

export function getAvailableMilestones(completedIds = []) {
  return getIncompleteMilestones(completedIds)
    .filter((milestone) =>
      milestone.requires.every((requirementId) =>
        completedIds.includes(requirementId)
      )
    )
    .sort((a, b) => b.priority - a.priority);
}

export function getNextMilestone(completedIds = []) {
  return getAvailableMilestones(completedIds)[0] ?? null;
}

export function getMissingRequirements(milestoneId, completedIds = []) {
  const milestone = getMilestone(milestoneId);

  if (!milestone) {
    return [];
  }

  return milestone.requires.filter(
    (requirementId) => !completedIds.includes(requirementId)
  );
}