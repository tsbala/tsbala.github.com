using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YieldExample
{
    class Program
    {
        static void Main(string[] args)
        {
            foreach (int i in Power(2, 8))
            {
                Console.Write("{0} ", i);
            }
            Console.ReadLine();
        }

        public static IEnumerable Power(int number, int exponent)
        {
            var counter = 0;
            var result = 1;

            while (counter++ < exponent)
            {
                result = result * number;
                // yield returns the result, but maintains the state of the local variables. 
                yield return result;
            }
        }
    }
}
