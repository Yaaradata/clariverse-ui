/**
 * data.ts — typed barrel over data/*.json.
 *
 * JSON imports widen literal unions ('USD' becomes string, tuples become arrays), so a
 * plain `import exec from '../data/exec.json'` is typed loosely. Import from here for
 * full types. check_mock.py (E1) compiles every JSON file against these interfaces
 * with tsc --strict, so the casts below are verified, not assumed.
 */
import anonymiseJson from '../data/anonymise.json';
import askLisnJson from '../data/askLisn.json';
import channelJson from '../data/channel.json';
import execJson from '../data/exec.json';
import installedBaseJson from '../data/installedBase.json';
import metaJson from '../data/meta.json';
import monitorJson from '../data/monitor.json';
import separationJson from '../data/separation.json';
import signalFw41Json from '../data/signal_fw41.json';
import type {
  AnonymiseMap, AskLisnItem, ChannelFile, ExecFile, InstalledBaseFile, MetaFile, MonitorFile,
  SeparationFile, Signal, SignalFw41File,
} from '../types';

export const meta = metaJson as unknown as MetaFile;
export const exec = execJson as unknown as ExecFile;
export const monitor = monitorJson as unknown as MonitorFile;
export const signalFw41 = signalFw41Json as unknown as SignalFw41File;
export const installedBase = installedBaseJson as unknown as InstalledBaseFile;
export const channel = channelJson as unknown as ChannelFile;
export const separation = separationJson as unknown as SeparationFile;
export const anonymise = anonymiseJson as unknown as AnonymiseMap;
export const askLisn = askLisnJson as unknown as AskLisnItem[];

/** Signal lookup by route slug: signalById['esd-se-07']. */
export const signalById: Record<string, Signal> = Object.fromEntries(monitor.signals.map((s) => [s.id, s]));

/** Legacy alias from 02 HS-1: /signals/A1 redirects here. */
export const LEGACY_ROUTES: Record<string, string> = { '/signals/A1': '/installed-base/signal/fw-4-1' };
