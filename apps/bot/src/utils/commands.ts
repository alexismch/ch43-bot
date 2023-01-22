import { SlashCommandBuilder } from '@discordjs/builders';
import {
   Collection,
   CommandInteraction,
   PermissionsBitField,
} from 'discord.js';
import * as rawCommands from '../commands';

export type Command = {
   isAdmin?: boolean;
   data: SlashCommandBuilder;
   execute(interaction: CommandInteraction): Promise<void>;
};

type CommandsAdapter<T = any> = {
   init(): void;
   add(command: Command): void;
   get(): T;
};

let commandsCollection: Collection<string, Command>;
const commandsCollectionAdapter: CommandsAdapter<Collection<string, Command>> =
   {
      add(command): void {
         commandsCollection.set(command.data.name, command);
      },
      get() {
         return commandsCollection;
      },
      init() {
         commandsCollection = new Collection();
      },
   };

let commandsArray: Command[];
const commandsArrayAdapter: CommandsAdapter<Command[]> = {
   add(command): void {
      commandsArray.push(command);
   },
   get() {
      return commandsArray;
   },
   init() {
      commandsArray = [];
   },
};

type CommandsCollections = 'COLLECTION' | 'ARRAY';
const commandsCollections: {
   [collectionName: string]: CommandsAdapter;
} = {
   COLLECTION: commandsCollectionAdapter,
   ARRAY: commandsArrayAdapter,
};

type getCommandsOptions = {
   isAdmin?: boolean;
};

const getCommands = (
   collectionType: CommandsCollections,
   options?: getCommandsOptions,
): Collection<string, Command> | Command[] => {
   const commands: CommandsAdapter = commandsCollections[collectionType];
   commands.init();

   for (const rawCommandKey in rawCommands) {
      const command: Command = rawCommands[rawCommandKey];
      if (options?.isAdmin !== undefined) {
         const isAdmin = command.isAdmin ?? false;
         if (options.isAdmin === isAdmin) {
            commands.add(command);
         }
      } else {
         commands.add(command);
      }
   }

   return commands.get();
};

export const getCommandsArray = (options?: getCommandsOptions): Command[] =>
   getCommands('ARRAY', options) as Command[];

export const getCommandsCollection = (
   options?: getCommandsOptions,
): Collection<string, Command> =>
   getCommands('COLLECTION', options) as Collection<string, Command>;

export const memberHasPermission = async (
   interaction: CommandInteraction,
): Promise<boolean> => {
   const isAdmin = (interaction.member.permissions as PermissionsBitField).has(
      PermissionsBitField.Flags.Administrator,
   );

   if (isAdmin) {
      return true;
   }

   try {
      const commandPermissions =
         interaction.command?.permissions ||
         (await interaction.guild?.commands.fetch(interaction.commandId))
            ?.permissions;

      return Boolean(await commandPermissions?.fetch({}));
   } catch {
      return false;
   }
};
