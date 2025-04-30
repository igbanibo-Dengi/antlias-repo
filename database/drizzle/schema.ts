import { sql, SQL } from "drizzle-orm";
import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    pgEnum,
    type AnyPgColumn,
    uniqueIndex,
    date,
    uuid,
    decimal,
    index,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { permission } from "process";

// custom lower function
export function lower(email: AnyPgColumn): SQL {
    return sql`lower(${email})`;
}

// Enums
export const roleEnum = pgEnum("role", ["tenant", "admin", "user"]);
export const tankStatusEnum = pgEnum("tank_status", ["active", "maintenance", "decommissioned"]);
export const expenseTypeEnum = pgEnum("expense_type", ["fuel", "maintenance", "salary", "utility", "other"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cash", "card", "transfer"]);

// ====================== CORE TABLES ======================

// Tenants 
export const tenants = pgTable(
    "tenants",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        logoUrl: text("logo_url"),
        contactPhone: text("contact_phone"),
        franchiseNumber: text("franchise_number"),
        numberOfStations: integer("number_of_stations"),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
);

export const users = pgTable(
    "users",
    {
        id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
        tenantId: uuid("tenant_id").notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        role: roleEnum("role").notNull(),
        name: text("name"),
        email: text("email").notNull(),
        emailVerified: timestamp("emailVerified", { mode: "date" }),
        image: text("image"),
        password: text("password"),
        lastActivityDate: date("last_activity_date").defaultNow(),
        isActive: boolean("is_active").default(true),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        emailUniqueIndex: uniqueIndex("users_email_idx").on(lower(table.email)),
        tenantEmailUnique: uniqueIndex("users_tenant_email_unique").on(table.tenantId, lower(table.email)),
        tenantActiveIdx: index("users_tenant_active_idx").on(table.tenantId, table.isActive),
        activityIdx: index("users_activity_idx").on(table.lastActivityDate),
    })
);

// ====================== BRANCH MANAGEMENT ======================

export const branches = pgTable(
    "branches",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        address: text("address").notNull(),
        city: text("city").notNull(),
        state: text("state").notNull(),
        managerId: text("manager_id")
            .references(() => users.id),
        contactPhone: text("contact_phone"),
        isActive: boolean("is_active").default(true),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        tenantIdx: index("branches_tenant_idx").on(table.tenantId),
        activeIdx: index("branches_active_idx").on(table.isActive).where(sql`is_active = true`),
        locationIdx: index("branches_location_idx").on(table.city, table.state),
    })
);


// Employees table (branch-specific employee data)
export const employees = pgTable(
    "employees",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: text("user_id").notNull()
            .references(() => users.id),
        tenantId: uuid("tenant_id").notNull()
            .references(() => tenants.id),
        branchId: uuid("branch_id").notNull()
            .references(() => branches.id),
        position: text("position"),
        hireDate: date("hire_date").notNull().defaultNow(),
        terminationDate: date("termination_date"),
        salary: integer("salary").default(0),
        commission: decimal("commission", { precision: 5, scale: 2 }),
        accountNumber: text("account_number"),
        accountName: text("account_name"),
        bankName: text("bank_name"),
        bvn: text("bvn"),
        guarantorName: text("guarantor_name"),
        guarantorPhone: text("guarantor_phone"),
        guarantorAddress: text("guarantor_address"),
        guarantorRelationship: text("guarantor_relationship"),
        isActive: boolean("is_active").default(true),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        userTenantBranchUnique: uniqueIndex("employees_user_tenant_branch_unique").on(
            table.userId, table.tenantId, table.branchId
        ),
        branchIdx: index("employees_branch_idx").on(table.branchId),
        activeIdx: index("employees_active_idx").on(table.isActive).where(sql`is_active = true`),
        positionIdx: index("employees_position_idx").on(table.position),
    })
);

export const sellingPrices = pgTable(
    "selling_prices",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        branchId: uuid("branch_id").notNull()
            .references(() => branches.id, { onDelete: "cascade" }),
        fuelType: text("fuel_type").notNull(),
        price: decimal("price", { precision: 10, scale: 2 }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        branchFuelIdx: uniqueIndex("selling_prices_branch_fuel_unique").on(
            table.branchId, table.fuelType
        ),
        fuelIdx: index("selling_prices_fuel_idx").on(table.fuelType),
    })
);

export const tanks = pgTable(
    "tanks",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        branchId: uuid("branch_id").notNull()
            .references(() => branches.id, { onDelete: "cascade" }),
        tankNumber: text("tank_number").notNull(),
        capacity: decimal("capacity", { precision: 10, scale: 2 }).notNull(),
        fuelType: text("fuel_type").notNull(),
        currentLevel: decimal("current_level", { precision: 10, scale: 2 }).notNull(),
        status: tankStatusEnum("status").notNull().default("active"),
        maintenanceSchedule: text("maintenance_schedule"),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        branchIdx: index("tanks_branch_idx").on(table.branchId),
        fuelStatusIdx: index("tanks_fuel_status_idx").on(table.fuelType, table.status),
        numberUnique: uniqueIndex("tanks_number_unique").on(table.tenantId, table.branchId, table.tankNumber),
    })
);

// ====================== FINANCIAL RECORDS ======================

export const expenses = pgTable(
    "expenses",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        branchId: uuid("branch_id").notNull()
            .references(() => branches.id, { onDelete: "cascade" }),
        submittedById: text("submitted_by_id").notNull()
            .references(() => users.id),
        expenseType: expenseTypeEnum("expense_type").notNull(),
        amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
        description: text("description"),
        receiptPhoto: text("receipt_photo"),
        date: date("date").notNull().defaultNow(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        branchDateIdx: index("expenses_branch_date_idx").on(table.branchId, table.date),
        typeIdx: index("expenses_type_idx").on(table.expenseType),
        submitterIdx: index("expenses_submitter_idx").on(table.submittedById),
    })
);

export const transactions = pgTable(
    "transactions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        branchId: uuid("branch_id").notNull()
            .references(() => branches.id, { onDelete: "cascade" }),
        employeeId: text("employee_id").notNull()
            .references(() => users.id),
        fuelType: text("fuel_type").notNull(),
        quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
        unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
        cash: decimal("cash", { precision: 10, scale: 2 }).notNull(),
        card: decimal("card", { precision: 10, scale: 2 }).notNull(),
        transfer: decimal("transfer", { precision: 10, scale: 2 }).notNull(),
        totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
        startTime: timestamp("start_time", { withTimezone: true }).notNull(),
        endTime: timestamp("end_time", { withTimezone: true }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        branchDateIdx: index("transactions_branch_date_idx").on(table.branchId, table.createdAt),
        employeeIdx: index("transactions_employee_idx").on(table.employeeId),
        fuelIdx: index("transactions_fuel_idx").on(table.fuelType),
    })
);

export const deliveryLogs = pgTable(
    "delivery_logs",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        branchId: uuid("branch_id").notNull()
            .references(() => branches.id, { onDelete: "cascade" }),
        tankId: uuid("tank_id")
            .references(() => tanks.id),
        supplier: text("supplier").notNull(),
        quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
        unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
        totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
        wayBill: text("way_bill_url"),
        receipt: text("receipt_url"),
        receivedById: text("received_by_id").notNull()
            .references(() => users.id),
        deliveryDate: date("delivery_date").notNull().defaultNow(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        branchDateIdx: index("deliveries_branch_date_idx").on(table.branchId, table.deliveryDate),
        supplierIdx: index("deliveries_supplier_idx").on(table.supplier),
        tankIdx: index("deliveries_tank_idx").on(table.tankId),
    })
);


// ====================== AUTH TABLES ======================

export const adminUserEmailAddresses = pgTable(
    "adminUserEmailAddresses",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        email: text("email").notNull(),
    },
    (table) => ({
        adminEmailUniqueIndex: uniqueIndex("adminEmailUniqueIndex").on(
            lower(table.email),
        ),
    }),
);

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    }),
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    }),
);

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => ({
        compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
        }),
    }),
);