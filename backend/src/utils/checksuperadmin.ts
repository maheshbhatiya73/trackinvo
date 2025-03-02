import User from '../model/user'; 

class CheckSuperadmin {
    private totalSuperadmins: number; 

    constructor() {
        this.totalSuperadmins = 0; 
    }

    async checker(): Promise<boolean> {
        try {
            const superadmins = await User.find({ role: "superadmin" });
            this.totalSuperadmins = superadmins.length;
            
            if (this.totalSuperadmins === 0) {
                const newSuperadmin = await User.createDefaultSuperadmin();
                if (newSuperadmin) {
                    this.totalSuperadmins = 1;
                }
            }
            
            console.log(`Found ${this.totalSuperadmins} superadmins`);
            return this.totalSuperadmins > 0;
        } catch (error) {
            console.error('Error checking superadmins:', error);
            return false;
        }
    }

    public getTotalSuperadmins(): number {
        return this.totalSuperadmins;
    }
}

export default new CheckSuperadmin();