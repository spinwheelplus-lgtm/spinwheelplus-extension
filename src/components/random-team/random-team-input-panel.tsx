import {
  ClipboardPaste,
  Crown,
  ListPlus,
  Minus,
  Plus,
  Settings2,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import { RandomTeamFileMenu } from "@/components/random-team/random-team-file-menu";
import { Button } from "@/components/ui/button";
import { HelpTip } from "@/components/ui/help-tip";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import { fillTemplate } from "@/lib/i18n/locale";
import { useMessages } from "@/lib/i18n/use-messages";
import {
  getCaptainCount,
  resolveMembersForGeneration,
} from "@/lib/random-team/member-input";
import {
  clampTeamCount,
  clampTeamSize,
  resolveTeamLimits,
} from "@/lib/random-team/team-limits";
import { useRandomTeamStore } from "@/store/random-team-store";
import { RANDOM_TEAM_MAX_MEMBERS } from "@/types/random-team";

export const RandomTeamInputPanel = () => {
  const messages = useMessages();
  const teamUi = messages.ui.team;
  const common = messages.ui.common;
  const nameUi = messages.ui.name;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const quickInputRef = useRef<HTMLInputElement>(null);
  const focusMemberIdRef = useRef<string | null>(null);
  const memberInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());
  const [quickName, setQuickName] = useState("");

  const members = useRandomTeamStore((state) => state.random_team_members);
  const splitMode = useRandomTeamStore((state) => state.random_team_split_mode);
  const teamCount = useRandomTeamStore((state) => state.random_team_team_count);
  const teamSize = useRandomTeamStore((state) => state.random_team_team_size);
  const balanced = useRandomTeamStore((state) => state.random_team_balanced);
  const shuffleBefore = useRandomTeamStore(
    (state) => state.random_team_shuffle_before,
  );
  const useCaptains = useRandomTeamStore(
    (state) => state.random_team_use_captains,
  );
  const allowDifferentSizes = useRandomTeamStore(
    (state) => state.random_team_allow_different_sizes,
  );
  const deduplicate = useRandomTeamStore(
    (state) => state.random_team_deduplicate,
  );
  const soundEnabled = useRandomTeamStore(
    (state) => state.random_team_sound_enabled,
  );
  const setMemberName = useRandomTeamStore(
    (state) => state.setRandomTeamMemberName,
  );
  const toggleCaptain = useRandomTeamStore(
    (state) => state.toggleRandomTeamCaptain,
  );
  const addMembersFromText = useRandomTeamStore(
    (state) => state.addRandomTeamMembersFromText,
  );
  const addMember = useRandomTeamStore((state) => state.addRandomTeamMember);
  const removeMember = useRandomTeamStore(
    (state) => state.removeRandomTeamMember,
  );
  const clearMembers = useRandomTeamStore(
    (state) => state.clearRandomTeamMembers,
  );
  const setSplitMode = useRandomTeamStore(
    (state) => state.setRandomTeamSplitMode,
  );
  const setTeamCount = useRandomTeamStore(
    (state) => state.setRandomTeamTeamCount,
  );
  const setTeamSize = useRandomTeamStore((state) => state.setRandomTeamTeamSize);
  const setBalanced = useRandomTeamStore((state) => state.setRandomTeamBalanced);
  const setShuffleBefore = useRandomTeamStore(
    (state) => state.setRandomTeamShuffleBefore,
  );
  const setUseCaptains = useRandomTeamStore(
    (state) => state.setRandomTeamUseCaptains,
  );
  const setAllowDifferentSizes = useRandomTeamStore(
    (state) => state.setRandomTeamAllowDifferentSizes,
  );
  const setDeduplicate = useRandomTeamStore(
    (state) => state.setRandomTeamDeduplicate,
  );
  const setSoundEnabled = useRandomTeamStore(
    (state) => state.setRandomTeamSoundEnabled,
  );

  const resolvedMembers = resolveMembersForGeneration(members, deduplicate);
  const memberCount = resolvedMembers.length;
  const captainCount = getCaptainCount(resolvedMembers);
  const limits = resolveTeamLimits({
    members: resolvedMembers,
    splitMode,
    teamCountSetting: teamCount,
    teamSizeSetting: teamSize,
    useCaptains,
  });

  const perTeam = Math.ceil(memberCount / limits.resolvedTeamCount);
  const helperText =
    memberCount === 0
      ? teamUi.addNames
      : splitMode === "count"
        ? fillTemplate(teamUi.aboutPerTeam, { count: perTeam })
        : fillTemplate(teamUi.teamsWithSize, {
            teams: limits.resolvedTeamCount,
            size: teamSize,
          });

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        toast.error(common.clipboardEmpty);
        return;
      }
      addMembersFromText(text);
      toast.success(nameUi.namesPasted);
    } catch {
      toast.error(common.couldNotReadClipboard);
    }
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      addMembersFromText(text, true);
      toast.success(nameUi.namesImported);
    } catch {
      toast.error(common.couldNotReadThatFile);
    }
  };

  const atNameCap = members.length >= RANDOM_TEAM_MAX_MEMBERS;

  const handleAddMember = (afterId?: string | null) => {
    const newMemberId = addMember(afterId);
    if (!newMemberId) {
      toast.error(fillTemplate(teamUi.maxNames, { max: RANDOM_TEAM_MAX_MEMBERS }));
      return;
    }
    focusMemberIdRef.current = newMemberId;
  };

  const submitQuickName = () => {
    const name = quickName.trim();
    if (!name || atNameCap) {
      quickInputRef.current?.focus();
      return;
    }
    const newMemberId = addMember(null, name);
    if (!newMemberId) {
      toast.error(fillTemplate(teamUi.maxNames, { max: RANDOM_TEAM_MAX_MEMBERS }));
      return;
    }
    setQuickName("");
    requestAnimationFrame(() => {
      const list = listRef.current;
      if (list) list.scrollTop = list.scrollHeight;
      quickInputRef.current?.focus();
    });
  };

  const handleQuickSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuickName();
  };

  useEffect(() => {
    const focusId = focusMemberIdRef.current;
    if (!focusId) return;
    memberInputRefs.current.get(focusId)?.focus();
    focusMemberIdRef.current = null;
  }, [members]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <div className="mb-4 flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold">{teamUi.names}</h2>
            <p className="text-sm text-muted-foreground">{teamUi.namesLead}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <RandomTeamFileMenu />
            <p className="font-medium whitespace-nowrap text-muted-foreground">
              {fillTemplate(teamUi.nameCount, { count: memberCount })}
            </p>
          </div>
        </div>

        <div
          ref={listRef}
          className="max-h-64 min-h-40 space-y-1 overflow-y-auto rounded-xl border border-border bg-background p-2"
        >
          {members.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {teamUi.emptyList}
            </p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-1 rounded-lg px-1 py-0.5 hover:bg-muted/50"
              >
                <Input
                  ref={(node) => {
                    if (node) {
                      memberInputRefs.current.set(member.id, node);
                      return;
                    }
                    memberInputRefs.current.delete(member.id);
                  }}
                  value={member.name}
                  onChange={(event) =>
                    setMemberName(member.id, event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddMember(member.id);
                    }
                  }}
                  placeholder={teamUi.enterName}
                  className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-1"
                  aria-label={teamUi.memberName}
                />
                <button
                  type="button"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  aria-label={fillTemplate(teamUi.insertAfter, {
                    name: member.name || teamUi.rowFallback,
                  })}
                  onClick={() => handleAddMember(member.id)}
                >
                  <ListPlus className="size-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    member.isCaptain
                      ? "bg-amber-500/15 text-amber-600"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  aria-label={fillTemplate(
                    member.isCaptain ? teamUi.removeCaptain : teamUi.makeCaptain,
                    { name: member.name || teamUi.memberFallback },
                  )}
                  aria-pressed={member.isCaptain}
                  onClick={() => toggleCaptain(member.id)}
                >
                  <Crown className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label={fillTemplate(teamUi.removeMember, {
                    name: member.name || teamUi.memberFallback,
                  })}
                  onClick={() => removeMember(member.id)}
                >
                  <Trash2 className="size-3.5" aria-hidden />
                </button>
              </div>
            ))
          )}
        </div>

        <form className="mt-3 flex items-center gap-2" onSubmit={handleQuickSubmit}>
          <Input
            ref={quickInputRef}
            value={quickName}
            aria-label={teamUi.quickAddAria}
            autoComplete="off"
            enterKeyHint="enter"
            name="team-quick-name"
            placeholder={teamUi.quickPlaceholder}
            title={
              atNameCap
                ? fillTemplate(teamUi.maxNames, { max: RANDOM_TEAM_MAX_MEMBERS })
                : teamUi.quickNameEnter
            }
            disabled={atNameCap}
            className="h-10 min-w-0 flex-1 bg-background"
            onChange={(event) => setQuickName(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.nativeEvent.isComposing) {
                event.preventDefault();
              }
            }}
          />
          <Button
            type="submit"
            variant="outline"
            className="h-10 shrink-0 gap-1.5 px-3 text-emerald-600 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-300"
            aria-label={teamUi.quickAddAria}
            disabled={atNameCap}
            title={
              atNameCap
                ? fillTemplate(teamUi.maxNames, { max: RANDOM_TEAM_MAX_MEMBERS })
                : teamUi.quickAddAria
            }
            onMouseDown={(event) => {
              event.preventDefault();
            }}
          >
            <Plus className="size-4 shrink-0" aria-hidden />
            {teamUi.quickAdd}
          </Button>
        </form>

        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handlePaste()}
          >
            <ClipboardPaste className="size-4" aria-hidden />
            {common.paste}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-4" aria-hidden />
            {common.import}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,text/plain"
            className="sr-only"
            aria-hidden
            onChange={(event) => void handleImportFile(event)}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={clearMembers}
            disabled={members.length === 0}
          >
            <Trash2 className="size-4" aria-hidden />
            {common.clear}
          </Button>
        </div>
      </div>

      <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <div className="mb-3 flex items-center gap-2 font-medium">
          <Settings2 className="size-4 text-primary" aria-hidden />
          {teamUi.teamSettings}
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
          <button
            type="button"
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium",
              splitMode === "count"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setSplitMode("count")}
          >
            {teamUi.numberOfTeams}
          </button>
          <button
            type="button"
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium",
              splitMode === "size"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setSplitMode("size")}
          >
            {teamUi.teamSizeLabel}
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 shrink-0"
            aria-label={
              splitMode === "count" ? teamUi.decreaseCount : teamUi.decreaseSize
            }
            onClick={() =>
              splitMode === "count"
                ? setTeamCount(
                    clampTeamCount(
                      teamCount - 1,
                      memberCount,
                      captainCount,
                      useCaptains,
                    ),
                  )
                : setTeamSize(clampTeamSize(teamSize - 1, memberCount))
            }
          >
            <Minus className="size-4" aria-hidden />
          </Button>
          <span className="min-w-12 text-center text-3xl font-bold tabular-nums">
            {splitMode === "count" ? teamCount : teamSize}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 shrink-0"
            aria-label={
              splitMode === "count" ? teamUi.increaseCount : teamUi.increaseSize
            }
            onClick={() =>
              splitMode === "count"
                ? setTeamCount(
                    clampTeamCount(
                      teamCount + 1,
                      memberCount,
                      captainCount,
                      useCaptains,
                    ),
                  )
                : setTeamSize(clampTeamSize(teamSize + 1, memberCount))
            }
          >
            <Plus className="size-4" aria-hidden />
          </Button>
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {helperText}
        </p>
        {useCaptains && captainCount > 0 ? (
          <p className="mt-1 text-center text-xs text-amber-700 dark:text-amber-400">
            {fillTemplate(teamUi.minCaptains, { count: captainCount })}
          </p>
        ) : null}
      </div>

      <div className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <p className="font-medium">{common.options}</p>
        <OptionRow
          id="random-team-balanced"
          label={teamUi.keepBalanced}
          help={teamUi.balancedHelp}
          checked={balanced}
          onCheckedChange={setBalanced}
        />
        <OptionRow
          id="random-team-shuffle"
          label={teamUi.shuffleBefore}
          help={teamUi.shuffleHelp}
          checked={shuffleBefore}
          onCheckedChange={setShuffleBefore}
        />
        <OptionRow
          id="random-team-captains"
          label={teamUi.useCaptains}
          help={teamUi.captainsHelp}
          checked={useCaptains}
          onCheckedChange={setUseCaptains}
        />
        <OptionRow
          id="random-team-uneven"
          label={teamUi.allowUneven}
          help={teamUi.unevenHelp}
          checked={allowDifferentSizes}
          onCheckedChange={setAllowDifferentSizes}
        />
        <OptionRow
          id="random-team-dedupe"
          label={teamUi.removeDuplicates}
          help={teamUi.dedupeHelp}
          checked={deduplicate}
          onCheckedChange={setDeduplicate}
        />
        <OptionRow
          id="random-team-sound"
          label={teamUi.revealSound}
          help={teamUi.soundHelp}
          checked={soundEnabled}
          onCheckedChange={setSoundEnabled}
          ariaLabel={teamUi.soundAria}
        />
      </div>
    </div>
  );
};

const OptionRow = ({
  id,
  label,
  help,
  checked,
  onCheckedChange,
  ariaLabel,
}: {
  id: string;
  label: string;
  help: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  ariaLabel?: string;
}) => {
  const messages = useMessages();
  return (
  <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 px-3 py-3">
    <p className="flex min-w-0 items-center gap-0.5 text-sm font-medium">
      {label}
      <HelpTip
        helpLabel={fillTemplate(messages.ui.common.helpFor, {
          label: label.toLowerCase(),
        })}
        helpTitle={label}
        helpText={help}
      />
    </p>
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={ariaLabel ?? label}
    />
  </div>
  );
};
